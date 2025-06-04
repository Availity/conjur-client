import type {
  ConjurPrivilege,
  ConjurResourceKind,
  IConjurListResourceOptions,
  IConjurResource,
  IConjurResourceCheckPermissionOptions
} from './interfaces/index.js';

import { ConjurApi } from './Api.js';
import {
  ConjurForbiddenError,
  ConjurResourceNotFoundError,
  ConjurUnauthenticatedError,
  InvalidSecretRequest
} from './errors/index.js';
import { ConjurLocator } from './Locator.js';
import { ConjurResourceBase, ConjurResourceMapper } from './resource/index.js';

export class ConjurClientResourcesApi extends ConjurApi {
  async checkPermission(account: string, kind: string, identifier: string, options: IConjurResourceCheckPermissionOptions = {}): Promise<boolean> {
    // https://docs.cyberark.com/conjur-open-source/latest/en/content/developer/conjur_api_check_permission.htm
    const { client } = this;
    const { conjurUrl } = client;
    
    const method = 'GET';
    const url = new URL(`/resources/${account}/${kind}/${identifier}`, conjurUrl);
    
    url.searchParams.set('check', 'true');
    for(const [ key, value ] of Object.entries(options)) {
      url.searchParams.set(key, value);
    }
    
    try {
      const response = await client.submit(url, { method });
      ConjurClientResourcesApi.handleResponse(`${account}:${kind}:${identifier}${url.search}`, response);
      return true;
    }
    catch(error) {
      if(error instanceof ConjurResourceNotFoundError)
        return false;
      
      throw error;
    }
  }
  
  static handleResponse(identifier: string, response: Response): Response {
    const { status, statusText } = response;
    const message = `Unable to retrieve resource(s) "${identifier}". HTTP ${status} ${statusText}`;
    
    switch(status) {
      case 401:
        throw new ConjurUnauthenticatedError(message);
      case 403:
        throw new ConjurForbiddenError(message);
      case 404:
        throw new ConjurResourceNotFoundError(message);
      case 422:
        throw new InvalidSecretRequest(message);
      default:
        return response;
    }
  }
  
  async list(account: string, options: IConjurListResourceOptions = {}): Promise<ConjurResourceMapper> {
    // https://docs.cyberark.com/conjur-open-source/latest/en/content/developer/conjur_api_list_resources.htm
    const { client } = this;
    const { conjurUrl } = client;
    
    const method = 'GET';
    const url = new URL(`/resources/${account}`, conjurUrl);
    
    for(const [ key, value ] of Object.entries(options)) {
      url.searchParams.set(key, value);
    }
    
    const response = await client.submit(url, { method });
    const body = await ConjurClientResourcesApi.handleResponse(url.search, response).json();
    return new ConjurResourceMapper(body as Array<IConjurResource>);
  }
  
  async permittedRoles(account: string, kind: ConjurResourceKind, identifier: string, privilege?: ConjurPrivilege): Promise<Array<ConjurLocator>> {
    // https://docs.cyberark.com/conjur-open-source/latest/en/content/developer/conjur_api_show_permitted_roles.htm
    const { client } = this;
    const { conjurUrl } = client;
    
    const method = 'GET';
    const url = new URL(`/resources/${account}/${kind}/${identifier}`, conjurUrl);
    url.searchParams.set('permitted_roles', 'true');
    if(privilege) url.searchParams.set('privilege', privilege);
    
    const response = await client.submit(url, { method });
    const body = await ConjurClientResourcesApi.handleResponse(`${account}:${kind}:${identifier}${url.search}`, response)
      .json();
    return Array.isArray(body) ? body.map(m => ConjurLocator.fromString(m)) : [];
  }
  
  async show(account: string, kind: ConjurResourceKind, identifier: string): Promise<ConjurResourceBase> {
    // https://docs.cyberark.com/conjur-open-source/latest/en/content/developer/conjur_api_show_resources.htm
    const { client } = this;
    const { conjurUrl } = client;
    
    const method = 'GET';
    const url = new URL(`/resources/${account}/${kind}/${identifier}`, conjurUrl);
    
    const response = await client.submit(url, { method });
    const body = await ConjurClientResourcesApi.handleResponse(`${account}:${kind}:${identifier}`, response)
      .json();
    return ConjurResourceMapper.parse(body as IConjurResource);
  }
}
