import type { ConjurPrivilege } from '../ConjurPrivilege.js';
import type { IConjurReplicationSet } from './IConjurReplicationSet.js';

export interface IConjurResourcePermission {
  policy: string;
  privilege: ConjurPrivilege;
  replication_sets: Array<IConjurReplicationSet>;
  role: string;
}
