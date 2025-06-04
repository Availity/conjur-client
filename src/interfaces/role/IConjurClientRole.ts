import type { IConjurClientRoleMember } from './IConjurClientRoleMember.js';

export interface IConjurClientRole {
  created_at: string;
  id: string;
  policy: string;
  members?: Array<IConjurClientRoleMember>;
}
