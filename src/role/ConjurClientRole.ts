import type { IConjurClientRole, IConjurLocator, IConjurTransformer } from '../interfaces/index.js';

import { ConjurLocator } from '../Locator.js';
import { ConjurClientRoleMember } from './ConjurClientRoleMember.js';

export class ConjurClientRole {
  readonly createdAt: Date;
  readonly id: IConjurLocator<ConjurClientRole>;
  readonly policy: ConjurLocator;
  readonly members: Array<ConjurClientRoleMember>;
  
  constructor(raw: IConjurClientRole) {
    this.createdAt = new Date(raw.created_at);
    this.id = ConjurLocator.fromString(raw.id, ConjurClientRole.mapper);
    this.policy = ConjurLocator.fromString(raw.policy);
    this.members = raw.members?.map(m => new ConjurClientRoleMember(m)) ?? [];
  }
  
  static mapper: IConjurTransformer<ConjurClientRole> = (raw: string): ConjurClientRole => new ConjurClientRole(JSON.parse(raw));
}
