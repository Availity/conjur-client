import type { ConjurPrivilege, IConjurReplicationSet, IConjurResourcePermission } from '../interfaces/index.js';
import { ConjurLocator } from '../Locator.js';

export class ConjurResourcePermission {
  readonly policy: ConjurLocator;
  readonly privilege: ConjurPrivilege;
  readonly replicationSets: Array<IConjurReplicationSet>;
  readonly role: ConjurLocator;
  
  constructor(raw: IConjurResourcePermission) {
    this.policy = ConjurLocator.fromString(raw.policy);
    this.privilege = raw.privilege;
    this.replicationSets = raw.replication_sets ?? [];
    this.role = ConjurLocator.fromString(raw.role);
  }
}
