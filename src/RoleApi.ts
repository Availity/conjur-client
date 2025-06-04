import type { IConjurClientRole, IConjurClientRoleMember } from './interfaces/index.js';

import { ConjurApi } from './Api.js';
import { ConjurUnauthenticatedError, ConjurForbiddenError, ConjurRoleNotFoundError } from './errors/index.js';
import { ConjurClientRole, ConjurClientRoleMember } from './role/index.js';

export class ConjurClientRoleApi extends ConjurApi {
  static async handleResponse<T>(identifier: string, response: Response): Promise<T> {
    const { status, statusText } = response;
    const message = `Unable to retrieve role "${identifier}". HTTP ${status} ${statusText}`;
    
    switch(status) {
      case 401:
        throw new ConjurUnauthenticatedError(message);
      case 403:
        throw new ConjurForbiddenError(message);
      case 404:
        throw new ConjurRoleNotFoundError(message);
      default:
        return await response.json() as Promise<T>;
    }
  }
  
  async listMembers(account: string, kind: string, identifier: string): Promise<Array<ConjurClientRoleMember>> {
    // https://docs.cyberark.com/conjur-enterprise/latest/en/content/developer/conjur_api_list_role_members.htm
    const { client } = this;
    const { conjurUrl } = client;
    const target = `/roles/${account}/${kind}/${identifier}?members`;
    
    const method = 'GET';
    const url = new URL(target, conjurUrl);
    
    const response = await client.submit(url, { method });
    const body: Array<IConjurClientRoleMember> = await ConjurClientRoleApi.handleResponse(target, response);
    return body.map(m => new ConjurClientRoleMember(m));
  }
  
  async listMemberships(account: string, kind: string, identifier: string): Promise<Array<ConjurClientRoleMember>> {
    // https://docs.cyberark.com/conjur-enterprise/latest/en/content/developer/conjur_api_list_role_membership.htm
    const { client } = this;
    const { conjurUrl } = client;
    const target = `/roles/${account}/${kind}/${identifier}?memberships`;
    
    const method = 'GET';
    const url = new URL(target, conjurUrl);
    
    const response = await client.submit(url, { method });
    const body: Array<IConjurClientRoleMember> = await ConjurClientRoleApi.handleResponse(target, response);
    return body.map(m => new ConjurClientRoleMember(m));
  }
  
  async show(account: string, kind: string, identifier: string): Promise<ConjurClientRole> {
    // https://docs.cyberark.com/conjur-enterprise/latest/en/content/developer/conjur_api_show_role.htm
    const { client } = this;
    const { conjurUrl } = client;
    const target = `/roles/${account}/${kind}/${identifier}`;
    
    const method = 'GET';
    const url = new URL(target, conjurUrl);
    
    const response = await client.submit(url, { method });
    const body: IConjurClientRole = await ConjurClientRoleApi.handleResponse(target, response);
    return new ConjurClientRole(body);
  }
}
