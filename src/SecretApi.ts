import type { IConjurMapping } from './interfaces/index.js';

import { ConjurApi } from './Api.js';
import { ConjurLocator } from './Locator.js';
import { ConjurForbiddenError, ConjurUnauthenticatedError, InvalidSecretRequest, SecretNotFoundError } from './errors/index.js';

export class ConjurClientSecretApi extends ConjurApi {
  static handleResponse(identifier: string, response: Response): Response {
    const { status, statusText } = response;
    const message = `Unable to retrieve secret "${identifier}". HTTP ${status} ${statusText}`;
    
    switch(status) {
      case 401:
        throw new ConjurUnauthenticatedError(message);
      case 403:
        throw new ConjurForbiddenError(message);
      case 404:
        throw new SecretNotFoundError(message);
      case 422:
        throw new InvalidSecretRequest(message);
      default:
        return response;
    }
  }
  
  async retrieve(account: string, kind: string, identifier: string): Promise<string> {
    // https://docs.cyberark.com/conjur-enterprise/latest/en/content/developer/conjur_api_retrieve_secret.htm
    const { client } = this;
    const { conjurUrl } = client;
    
    const method = 'GET';
    const url = new URL(`/secrets/${account}/${kind}/${identifier}`, conjurUrl);
    
    const response = await client.submit(url, { method });
    ConjurClientSecretApi.handleResponse(`${account}:${kind}:${identifier}`, response);
    return await response.text();
  }
  
  async retrieveMapped<
    T extends Record<string, unknown> = Record<string, string>,
    K extends string & keyof T = string & keyof T,
    V extends T[K] = T[K]
  >(mapping: IConjurMapping<T, K, V>): Promise<T> {
    const transform = ConjurLocator.fromMapping<T, K, V>(mapping);
    
    const result = {} as T;
    
    if(transform.size === 0)
      return result;
    
    const identifiers = Array.from(transform.keys());
    const secret = await this.retrieveBatch(...identifiers);
    
    for(const [ property, { entry: { key, mapper } } ] of transform) {
      const { [property]: value } = secret;
      result[key] = mapper(value);
    }
    
    return result;
  }
  
  async retrieveBatch(...identifiers: Array<string>): Promise<Record<string, string>> {
    // https://docs.cyberark.com/conjur-enterprise/latest/en/content/developer/conjur_api_batch_retrieve.htm
    const { client } = this;
    const { conjurUrl } = client;
    
    const method = 'GET';
    const url = new URL('/secrets', conjurUrl);
    const variableIds = identifiers.join(',');
    url.searchParams.append('variable_ids', variableIds);
    
    const response = await client.submit(url, { method });
    ConjurClientSecretApi.handleResponse(variableIds, response);
    return await response.json() as Promise<Record<string, string>>;
  }
  
  async set<T extends string | Buffer>(account: string, kind: string, identifier: string, body: T) {
    // https://docs.cyberark.com/conjur-enterprise/latest/en/content/developer/conjur_api_set_secret.htm
    const { client } = this;
    const { conjurUrl } = client;
    
    const method = 'POST';
    const url = new URL(`/secrets/${account}/${kind}/${identifier}`, conjurUrl);
    
    const response = await client.submit(url, { body, method });
    ConjurClientSecretApi.handleResponse(`${account}:${kind}:${identifier}`, response);
  }
}
