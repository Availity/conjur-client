import type { IConjurReplicationSet, IConjurResourceVariable } from '../interfaces/index.js';

import { ConjurLocator } from '../Locator.js';
import { ConjurResourcePermission } from './Permission.js';
import { ConjurResourceVariableAnnotation } from './VariableAnnotation.js';
import { ConjurResourceBase } from './Base.js';

export class ConjurResourceVariable extends ConjurResourceBase {
  readonly annotations: Array<ConjurResourceVariableAnnotation>;
  readonly createdAt: Date;
  readonly permissions: Array<ConjurResourcePermission>;
  readonly policy: ConjurLocator;
  readonly replicationSets: Array<IConjurReplicationSet>;
  
  constructor(raw: IConjurResourceVariable) {
    super(raw);
    this.annotations = raw.annotations?.map(a => new ConjurResourceVariableAnnotation(a)) ?? [];
    this.createdAt = raw.created_at ? new Date(raw.created_at) : new Date();
    this.permissions = raw.permissions?.map(p => new ConjurResourcePermission(p)) ?? [];
    this.policy = ConjurLocator.fromString(raw.policy ?? 'Unknown:policy:Unknown');
    this.replicationSets = raw.replication_sets ?? [];
  }
}
