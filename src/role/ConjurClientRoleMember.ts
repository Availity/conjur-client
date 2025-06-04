import type { IConjurClientRoleMember } from '../interfaces/index.js';

import { ConjurLocator } from '../Locator.js';

export class ConjurClientRoleMember {
  readonly adminOption: boolean;
  readonly member: ConjurLocator;
  readonly ownership: boolean;
  readonly policy: ConjurLocator;
  readonly role: ConjurLocator;
  
  constructor(raw: IConjurClientRoleMember) {
    this.adminOption = raw.admin_option || false;
    this.member = ConjurLocator.fromString(raw.member);
    this.ownership = raw.ownership || false;
    this.policy = ConjurLocator.fromString(raw.policy);
    this.role = ConjurLocator.fromString(raw.role);
  }
}
