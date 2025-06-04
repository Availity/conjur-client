import type { IConjurReplicationSet, IConjurResourceVariableAnnotation } from '../interfaces/index.js';

import { ConjurLocator } from '../Locator.js';

export class ConjurResourceVariableAnnotation {
  readonly name: string;
  readonly policy: ConjurLocator;
  readonly replicationSets: Array<IConjurReplicationSet>;
  readonly value: string;
  
  constructor(raw: IConjurResourceVariableAnnotation) {
    this.name = raw.name;
    this.policy = ConjurLocator.fromString(raw.policy);
    this.replicationSets = raw.replication_sets ?? [];
    this.value = raw.value;
  }
}
