import querystring from 'node:querystring';

import type { IConjurApiKeyRotationOptions, IConjurAuthenticateRequestOptions } from './interfaces/index.js';
import {
  ConjurError,
  ConjurForbiddenError,
  ConjurUnauthenticatedError,
  ConjurUnsupportedRoleTypeError
} from './errors/index.js';
import { ConjurSessionToken } from './token/index.js';
import { ConjurClient } from './Client.js';

export class ConjurAuthenticator {
  readonly conjurUrl: URL;
  
  constructor(url: string) {
    this.conjurUrl = new URL(url);
  }
  
  async authenticate(options: IConjurAuthenticateRequestOptions) {
    // https://docs.cyberark.com/conjur-enterprise/latest/en/content/developer/conjur_api_authenticate.htm
    const { conjurUrl } = this;
    const { account, apiKey, gitlab, login } = options;
    const authenticator = options.authenticator ?? (gitlab ? 'authn-jwt' : 'authn');
    const headers: Record<string, string> = { 'Accept-Encoding': 'base64' };
    
    let body: string;
    let url: URL;
    
    if(account && gitlab) {
      // https://docs.cyberark.com/conjur-open-source/latest/en/content/developer/conjur_api_jwt_authenticator.htm
      body = querystring.stringify({ jwt: gitlab });
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      url = new URL(`/${authenticator}/gitlab/${account}/authenticate`, conjurUrl);
    }
    else if(account && apiKey && login) {
      // https://docs.cyberark.com/conjur-open-source/latest/en/content/developer/conjur_api_api-key-authn.htm
      const username = querystring.escape(login);
      body = apiKey;
      url = new URL(`/${authenticator}/${account}/${username}/authenticate`, conjurUrl);
    }
    else {
      throw new ConjurError('Invalid authentication options');
    }
    
    const request: RequestInit = { body, method: 'POST', headers };
    const response = await fetch(url, request);
    const rawToken = await ConjurAuthenticator.handleResponse('authenticate', response);
    const sessionToken = new ConjurSessionToken(rawToken);
    return new ConjurClient(this.conjurUrl, sessionToken, { url, ...request });
  }
  
  static async handleResponse(action: string, response: Response): Promise<string> {
    const { status, statusText } = response;
    const message = `Unable to perform "${action}". HTTP ${status} ${statusText}`;
    const body = await response.text();
    
    switch(status) {
      case 401:
        throw new ConjurUnauthenticatedError(message);
      case 403:
        throw new ConjurForbiddenError(message);
      case 405:
        throw new ConjurUnsupportedRoleTypeError(message);
      default:
        return body;
    }
  }
  
  async rotateApiKey(account: string, options: IConjurApiKeyRotationOptions, role?: string): Promise<string> {
    // https://docs.cyberark.com/conjur-open-source/latest/en/content/developer/conjur_api_rotate_personal_api_key.htm
    const { conjurUrl } = this;
    const { apiKey, login } = options;
    
    if(!apiKey || !login)
      throw new ConjurError('Invalid authentication options for API key rotation');
    
    const plain = [ login, apiKey ].join(':');
    const headers = { 'Authorization': `Basic ${btoa(plain)}` };
    const method = 'PUT';
    const url = new URL(`/authn/${account}/api_key`, conjurUrl);
    
    if(role)
      url.searchParams.append('role', role);
    
    const response = await fetch(url, { headers, method });
    const body = await ConjurAuthenticator.handleResponse('rotate API key', response);
    console.log('New API Key =>', body);
    return body;
  }
}
