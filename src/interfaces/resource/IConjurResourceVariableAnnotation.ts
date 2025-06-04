import type { IConjurReplicationSet } from './IConjurReplicationSet.js';

export interface IConjurResourceVariableAnnotation {
  name: string;
  policy: string;
  replication_sets: Array<IConjurReplicationSet>;
  value: string;
}
