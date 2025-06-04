import crypto from 'node:crypto';
import type { IncomingMessage, ServerResponse, RequestListener } from 'node:http';

import type {
  IConjurSessionTokenHeader,
  IConjurSessionTokenPayloadRaw,
  IConjurSessionTokenRaw,
  SupportedEncoding
} from '../interfaces/index.js';
import { ConjurSessionToken } from '../token/index.js';
import { DateExt } from './DateExt.js';
import { default as random } from './random.js';
import { StringExt } from './StringExt.js';
import { TokenCache } from './TokenCache.js';

export class MockConjurService {
  static readonly default = new MockConjurService(new TokenCache());
  static readonly key: crypto.BinaryLike | crypto.KeyObject = crypto.generateKeySync('hmac', { length: 2048 });
  static readonly secretsCache = new Map<string, string>();
  static readonly userId = random.number(50, 500).toString(10);
  static readonly userLogin = random.fromCharset('abcdefghijklmnopqrstuvwxyz');
  // Used in API Key authentication test
  static readonly apiLogin = `host/${MockConjurService.userLogin}`;
  static readonly apiKey = random.base64(120);
  // Used in GitLab JWT authentication test
  static readonly gitlab = MockConjurService.generateGitLabJwt(MockConjurService.key);
  readonly #tokenCache: TokenCache;
  
  constructor(tokenCache: TokenCache) {
    this.#tokenCache = tokenCache;
  }
  
  static #getRequestBody(request: IncomingMessage): Promise<Buffer> {
    return new Promise((resolve) => {
      const body: Array<Buffer> = [];
      request.on('data', (chunk) => body.push(chunk));
      request.on('end', () => resolve(Buffer.concat(body)));
    });
  }
  
  apiAuthenticateHandler(request: IncomingMessage, response: ServerResponse) {
    const { headers } = request;
    const acceptEncoding = MockConjurService.getHeader(headers, 'accept-encoding') ?? 'utf-8';
    const encoding: SupportedEncoding = acceptEncoding === 'base64' ? 'base64url' : acceptEncoding as SupportedEncoding;
    
    MockConjurService.#getRequestBody(request).then(body => {
      if(body.toString('utf-8') === MockConjurService.apiKey) {
        const rawToken = MockConjurService.createConjurSessionToken(encoding);
        const data = new ConjurSessionToken(rawToken);
        this.#tokenCache.add(data);
        
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write(rawToken);
      } else if(body.length > 0) {
        response.writeHead(401);
      } else {
        response.writeHead(400);
      }
    }).finally(() => response.end());
  }
  
  static apiAuthenticateHandler = (
    MockConjurService.prototype.apiAuthenticateHandler.bind(MockConjurService.default)
  ) as RequestListener;
  
  static convertToJwt(header: unknown, body: unknown, key: crypto.BinaryLike | crypto.KeyObject): string {
    const unsigned = [
      Buffer.from(JSON.stringify(header)).toString('base64url'),
      Buffer.from(JSON.stringify(body)).toString('base64url')
    ].join('.');
    
    const signature = crypto.createHmac('SHA256', key)
      .update(unsigned)
      .digest('base64url');
    
    return `${unsigned}.${signature}`;
  }
  
  close() {
    this.#tokenCache.close();
  }
  
  static createConjurSessionToken(encoding: SupportedEncoding = 'utf-8', key: crypto.BinaryLike | crypto.KeyObject = MockConjurService.key): string {
    const alg = 'RS256';
    const kid = random.base64(43);
    const issuedAt = new DateExt();
    const expiry = issuedAt.dateMath({ minutes: 8 });
    const sub = random.ascii(20);
    
    const exp = Math.trunc(expiry.valueOf() / 1e3);
    const iat = Math.trunc(issuedAt.valueOf() / 1e3);
    
    const rawHeader: IConjurSessionTokenHeader = { alg, kid };
    const rawPayload: IConjurSessionTokenPayloadRaw = { exp, iat, sub };
    
    const header = new StringExt(JSON.stringify(rawHeader)).toString('base64url');
    const body = new StringExt(JSON.stringify(rawPayload)).toString('base64url');
    const encoded = [ header, body ].join('.');
    const signature = crypto.createHmac('SHA256', key).update(encoded).digest('base64url');
    const token: IConjurSessionTokenRaw = { 'protected': header, payload: body, signature };
    
    return new StringExt(JSON.stringify(token)).toString(encoding);
  }
  
  static generateGitLabJwt(key: crypto.BinaryLike | crypto.KeyObject): string {
    // Constructing the mocked GitLab JWT
    const nbf = new DateExt();
    const exp = nbf.dateMath({ hours: 2 });
    const iat = nbf.dateMath({ milliseconds: random.number(10, 100) });
    const iss = 'http://localhost';
    
    const aud = iss;
    const job_id = iat.valueOf().toString(10);
    const jti = crypto.randomUUID();
    const namespace_id = random.number(200, 600).toString(10);
    const namespace_path = 'avqa/unit-test/conjur/Client';
    const pipeline_id = Math.trunc(iat.valueOf() / 1_000);
    const pipeline_source = 'unit_test';
    const project_id = random.number(200, 900).toString(10);
    const project_visibility = 'private';
    const ref = 'origin/main';
    const ref_protected = false;
    const ref_type = 'branch';
    const runner_id = random.number(10, 200);
    const runner_environment = 'local';
    const user_id = MockConjurService.userId;
    const user_access_level = 'developer';
    const user_login = MockConjurService.userLogin;
    const user_email = `${user_login}@unit-test.availity.dev`;
    const sub = `project_path:${namespace_path}:ref_type:${ref_type}:ref:${ref}`;
    
    const fakeJwtHeader = {
      kid: random.base64(43),
      typ: 'JWT',
      alg: 'RS256'
    };
    
    const fakeJwtInit = {
      aud,
      exp,
      iat,
      iss,
      job_id,
      jti,
      namespace_id,
      namespace_path,
      nbf,
      pipeline_id,
      pipeline_source,
      project_id,
      project_visibility,
      ref,
      ref_type,
      ref_protected,
      runner_environment,
      runner_id,
      sub,
      user_access_level,
      user_email,
      user_id,
      user_login,
    };
    
    const sha = crypto.createHash('SHA1').update(JSON.stringify(fakeJwtInit)).digest('base64url');
    const fakeJwtBody = { ...fakeJwtInit, sha };
    return MockConjurService.convertToJwt(fakeJwtHeader, fakeJwtBody, key);
  }
  
  static getHeader(headers: unknown, name: string): string | undefined {
    const pattern = new RegExp(name, 'i');
    const collection: Array<[ string, string ]> = Array.isArray(headers) ? headers : Object.entries(headers as Record<string, string>);
    
    for(const [ key, value ] of collection)
      if(pattern.test(key))
        return value;
    
    return undefined;
  }
  
  getSecretBatchHandler(request: IncomingMessage, response: ServerResponse) {
    const { headers = {}, url: path = '/' } = request;
    if(!this.validateAuth(headers)) {
      response.writeHead(401);
      return;
    }
    
    const url =  new URL(path, 'http://localhost');
    const variableIds = url.searchParams.get('variable_ids')?.split(',') ?? [];
    const map: Map<string, string> = new Map();
    
    // Iterate over keys for cache
    for(const identifier of variableIds)
      if(MockConjurService.secretsCache.has(identifier))
        map.set(identifier, MockConjurService.secretsCache.get(identifier) ?? '');
    
    if(map.size === 0) {
      response.writeHead(404);
    } else {
      const obj = Object.fromEntries(map.entries());
      const data = JSON.stringify(obj);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(data);
    }
    
    response.end();
  }
  
  static getSecretBatchHandler = (
    MockConjurService.prototype.getSecretBatchHandler.bind(MockConjurService.default)
  ) as RequestListener;
  
  getSecretHandler(request: IncomingMessage, response: ServerResponse) {
    const { headers = {}, url: path = '/' } = request;
    if(!this.validateAuth(headers))
      return { statusCode: 401 };
    
    const { pathname } = new URL(path, 'http://localhost');
    const [ , , account, kind, ...identifier ] = pathname.split('/');
    const key = `${account}:${kind}:${identifier.join('/')}`;
    
    const data = MockConjurService.secretsCache.get(key);
    if(data) {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(data);
    } else {
      response.writeHead(404);
    }
    
    response.end();
  }
  
  static getSecretHandler = (
    MockConjurService.prototype.getSecretHandler.bind(MockConjurService.default)
  ) as RequestListener;
  
  jwtAuthenticateHandler(request: IncomingMessage, response: ServerResponse) {
    const { headers = {} } = request;
    const acceptEncoding = MockConjurService.getHeader(headers, 'Accept-Encoding') ?? 'utf-8';
    const encoding: SupportedEncoding = acceptEncoding === 'base64' ? 'base64url' : acceptEncoding as SupportedEncoding;
    
    MockConjurService.#getRequestBody(request).then(body => {
      const [ , jwt ] = body.toString('utf-8').split('=');
      
      if(jwt === MockConjurService.gitlab) {
        const rawToken = MockConjurService.createConjurSessionToken(encoding);
        const data = new ConjurSessionToken(rawToken);
        this.#tokenCache.add(data);
        
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write(rawToken);
      }
      else if(!jwt) {
        response.writeHead(400);
      }
      else {
        response.writeHead(401);
      }
    }).finally(() => response.end());
  }
  
  static jwtAuthenticateHandler = (
    MockConjurService.prototype.jwtAuthenticateHandler.bind(MockConjurService.default)
  ) as RequestListener;
  
  static listener: RequestListener = (request: IncomingMessage, response: ServerResponse) => {
    const { url = '/' } = request;
    const { pathname } = new URL(url, 'http://localhost');
    const pathSegments = pathname.split('/');

    if(pathSegments.includes('authn') && pathSegments.includes('authenticate')) {
      MockConjurService.apiAuthenticateHandler(request, response);
    }
    else if(pathSegments.includes('authn-jwt') && pathSegments.includes('authenticate')) {
      MockConjurService.jwtAuthenticateHandler(request, response);
    }
    else if(pathname.includes('/secrets/')) {
      MockConjurService.getSecretHandler(request, response);
    }
    else if(pathname.endsWith('/secrets')) {
      MockConjurService.getSecretBatchHandler(request, response);
    }
    else if(pathname === '/') {
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.write('Hello there!');
      response.end();
    }
    else {
      response.writeHead(500);
      response.end();
    }
  };
  
  validateAuth(headers: unknown): boolean {
    const authorization = MockConjurService.getHeader(headers, 'Authorization') ?? '';
    const [ , token = '<Missing>' ] = authorization.split('"');
    
    return this.#tokenCache.validate(token);
  }
}
