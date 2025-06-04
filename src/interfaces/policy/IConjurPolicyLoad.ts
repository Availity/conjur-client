import type { IConjurPolicyLoadCreatedRole } from './IConjurPolicyLoadCreatedRole.js';

export interface IConjurPolicyLoad {
  created_roles: Record<string, IConjurPolicyLoadCreatedRole>;
  version: number;
}
