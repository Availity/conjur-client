import type { ConjurPrivilege } from '../ConjurPrivilege.js';

export interface IConjurResourceCheckPermissionOptions {
  role?: string;
  priviliege?: ConjurPrivilege;
}
