import type { IConjurAuthenticateRequest, IConjurClient } from './interfaces/index.js';

import { ConjurClientPolicyApi } from './PolicyApi.js';
import { ConjurClientResourcesApi } from './ResourcesApi.js';
import { ConjurClientRoleApi } from './RoleApi.js';
import { ConjurClientSecretApi } from './SecretApi.js';
import { ConjurSessionToken } from './token/index.js';

export class ConjurClient implements IConjurClient {
  readonly #authenticateRequest: IConjurAuthenticateRequest;
  readonly conjurUrl: URL;
  readonly policy: ConjurClientPolicyApi;
  readonly resources: ConjurClientResourcesApi;
  readonly role: ConjurClientRoleApi;
  readonly secret: ConjurClientSecretApi;
  #sessionToken: ConjurSessionToken;

  constructor(conjurUrl: string | URL, sessionToken: ConjurSessionToken, authenticateRequest: IConjurAuthenticateRequest) {
    this.#authenticateRequest = authenticateRequest;
    this.conjurUrl = new URL(conjurUrl);
    this.policy = new ConjurClientPolicyApi(this);
    this.resources = new ConjurClientResourcesApi(this);
    this.role = new ConjurClientRoleApi(this);
    this.secret = new ConjurClientSecretApi(this);
    this.#sessionToken = sessionToken;
  }
  
  async submit(url: URL, request: RequestInit): Promise<Response> {
    if(!this.#sessionToken.isValid) {
      const { url, ...authRequest } = this.#authenticateRequest;
      const response = await fetch(url, authRequest);
      const rawToken = await response.text();
      this.#sessionToken = new ConjurSessionToken(rawToken);
    }
    
    const Authorization: string = `Token token="${this.#sessionToken}"`;
    request.headers ??= {} as Record<string, string>;
    if(Array.isArray(request.headers))
      request.headers.push(['Authorization', Authorization ]);
    else
      Object.assign(request.headers, { Authorization });
    
    return await fetch(url, request);
  }
}
