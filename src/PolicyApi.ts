import type {
  IConjurPolicyLoad,
  IConjurPolicyLoadFailure,
  IConjurPolicyLoadDryRunSuccess
} from './interfaces/index.js';

import {
  ConjurError,
  ConjurForbiddenError,
  ConjurInvalidPolicyRequestError,
  ConjurInvalidResourceBodyError,
  ConjurPolicyNotFoundError,
  ConjurUnauthenticatedError
} from './errors/index.js';

import { ConjurApi } from './Api.js';

export class ConjurClientPolicyApi extends ConjurApi {
  async get(account: string, identifier: string): Promise<string> {
    // https://docs.cyberark.com/conjur-enterprise/latest/en/content/developer/conjur_api_effective_policy.htm
    const { client } = this;
    const { conjurUrl } = client;
    
    const method = 'GET';
    const url = new URL(`/policies/${account}/policy/${identifier}`, conjurUrl);
    const response = await client.submit(url, { method });
    return ConjurClientPolicyApi.handleResponse(`${account}:policy:${identifier}`, response);
  }
  
  static async handleResponse<T>(identifier: string, response: Response) {
    const { status, statusText } = response;
    const builder = [ `Unable to process "${identifier}". HTTP ${status} ${statusText}` ];
    const body = await response.json();
    
    if(ConjurClientPolicyApi.isPolicyLoadFailure(body)) {
      const { errors, status } = body;
      for (const error of errors) {
        const { column, line, message } = error;
        builder.push(`${status} (${line}:${column}): ${message}`.trim());
      }
    }
    
    const message = builder.join('\n\t');
    switch(status) {
      case 400:
        throw new ConjurInvalidResourceBodyError(`Bad request: ${message}`);
      case 401:
        throw new ConjurUnauthenticatedError(message);
      case 403:
        throw new ConjurForbiddenError(message);
      case 404:
        throw new ConjurPolicyNotFoundError(message);
      case 422:
        throw new ConjurInvalidPolicyRequestError(`Invalid or missing parameter: ${message}`);
      case 500:
        throw new ConjurError(`Internal server error: ${message}`);
      default:
        return body as T;
    }
  }
  
  static isPolicyLoad(body: unknown): body is IConjurPolicyLoad {
    return body != null && typeof body === 'object' && 'version' in body && typeof body.version === 'number';
  }
  
  static isPolicyLoadFailure(body: unknown): body is IConjurPolicyLoadFailure {
    return body != null && typeof body === 'object' && 'errors' in body && Array.isArray(body.errors);
  }
  
  static isPolicyLoadDryRunSuccess(body: unknown): body is IConjurPolicyLoadDryRunSuccess {
    return body != null && typeof body === 'object' && 'created' in body && 'updated' in body && 'deleted' in body;
  }
  
  async load(account: string, identifier: string, policy: string, dryRun = false) {
    // https://docs.cyberark.com/conjur-enterprise/latest/en/content/developer/conjur_api_append_policy.htm
    return this.#write('POST', account, identifier, policy, dryRun);
  }
  
  async replace(account: string, identifier: string, policy: string, dryRun = false) {
    // https://docs.cyberark.com/conjur-enterprise/latest/en/content/developer/conjur_api_replace_policy.htm
    return this.#write('PUT', account, identifier, policy, dryRun);
  }
  
  update(account: string, identifier: string, policy: string, dryRun = false) {
    // https://docs.cyberark.com/conjur-enterprise/latest/en/content/developer/conjur_api_update_policy.htm
    return this.#write('PATCH', account, identifier, policy, dryRun);
  }
  
  async #write(method: string, account: string, identifier: string, policy: string, dryRun = false) {
    const { client } = this;
    const { conjurUrl } = client;
    
    const url = new URL(`/policies/${account}/policy/${identifier}`, conjurUrl);
    if(dryRun) url.searchParams.append('dryRun', 'true');
    
    const response = await client.submit(url, { body: policy, method });
    const body = await ConjurClientPolicyApi.handleResponse(`Load ${account}:policy:${identifier}`, response);
    
    if(ConjurClientPolicyApi.isPolicyLoad(body)) {
      return body as IConjurPolicyLoad;
    }
    if(ConjurClientPolicyApi.isPolicyLoadFailure(body)) {
      return body as IConjurPolicyLoadFailure;
    }
    if(ConjurClientPolicyApi.isPolicyLoadDryRunSuccess(body)) {
      return body as IConjurPolicyLoadDryRunSuccess;
    }
    
    return body;
  }
}
