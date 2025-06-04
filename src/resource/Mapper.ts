import type { IConjurResource, IConjurResourcePolicy } from '../interfaces/index.js';

import { ConjurResourceGroup } from './Group.js';
import { ConjurResourceHost } from './Host.js';
import { ConjurResourceLayer } from './Layer.js';
import { ConjurResourcePolicy } from './Policy.js';
import { ConjurResourceUser } from './User.js';
import { ConjurResourceVariable } from './Variable.js';
import { ConjurResourceWebService } from './WebService.js';
import { ConjurResourceBase } from './Base.js';

export class ConjurResourceMapper {
  readonly groups: Array<ConjurResourceGroup>;
  readonly hosts: Array<ConjurResourceHost>;
  readonly layers: Array<ConjurResourceLayer>;
  readonly policies: Array<ConjurResourcePolicy>;
  readonly users: Array<ConjurResourceUser>;
  readonly variables: Array<ConjurResourceVariable>;
  readonly webServices: Array<ConjurResourceWebService>;
  
  constructor(resources: Array<IConjurResource>) {
    this.groups = [];
    this.hosts = [];
    this.layers = [];
    this.policies = [];
    this.users = [];
    this.variables = [];
    this.webServices = [];
    
    for (const raw of resources) {
      const resource = ConjurResourceMapper.parse(raw);
      if(resource instanceof ConjurResourceGroup) this.groups.push(resource);
      else if(resource instanceof ConjurResourceHost) this.hosts.push(resource);
      else if(resource instanceof ConjurResourceLayer) this.layers.push(resource);
      else if(resource instanceof ConjurResourcePolicy) this.policies.push(resource);
      else if(resource instanceof ConjurResourceUser) this.users.push(resource);
      else if(resource instanceof ConjurResourceVariable) this.variables.push(resource);
      else if(resource instanceof ConjurResourceWebService) this.webServices.push(resource);
    }
  }
  
  static parse(resource: IConjurResource): ConjurResourceBase {
    const [ , type ] = resource.id.split(':');
    
    switch (type) {
      case 'group':
        return new ConjurResourceGroup(resource);
      case 'host':
        return new ConjurResourceHost(resource);
      case 'layer':
        return new ConjurResourceLayer(resource);
      case 'policy': {
        const { body: rawBody = [] as Array<IConjurResource> } = (resource as IConjurResourcePolicy);
        const body = new ConjurResourceMapper(rawBody).toArray();
        return new ConjurResourcePolicy(resource, body);
      }
      case 'user':
        return new ConjurResourceUser(resource);
      case 'variable':
        return new ConjurResourceVariable(resource);
      case 'webservice':
        return new ConjurResourceWebService(resource);
      default:
        return new ConjurResourceBase(resource);
    }
  }
  
  [Symbol.iterator]() {
    return this.toArray()[Symbol.iterator]();
  }
  
  toArray(): Array<ConjurResourceBase> {
    return Array.prototype.concat.call([] as Array<ConjurResourceBase>,
      this.groups,
      this.hosts,
      this.layers,
      this.policies,
      this.users,
      this.variables,
      this.webServices
    );
  }
}
