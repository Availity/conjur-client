import type { IConjurReplicationSet } from './IConjurReplicationSet.js';
import type { IConjurResource } from './IConjurResource.js';
import type { IConjurResourcePermission } from './IConjurResourcePermission.js';
import type { IConjurResourceVariableAnnotation } from './IConjurResourceVariableAnnotation.js';
import type { IConjurResourceVariableSecret } from './IConjurResourceVariableSecret.js';


export interface IConjurResourceVariable extends IConjurResource {
  annotations?: Array<IConjurResourceVariableAnnotation>;
  created_at?: string;
  id: string;
  mime_type?: string;
  owner: string;
  policy?: string;
  permissions?: Array<IConjurResourcePermission>;
  replication_sets?: Array<IConjurReplicationSet>;
  secrets?: Array<IConjurResourceVariableSecret>;
}
