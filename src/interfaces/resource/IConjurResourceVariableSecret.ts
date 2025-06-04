import type { IConjurReplicationSet } from './IConjurReplicationSet.js';

export interface IConjurResourceVariableSecret {
  expires_at: null | string;
  replication_sets: Array<IConjurReplicationSet>;
  version: number;
}
