import type { IConjurResource } from '../interfaces/index.js';

import { ConjurLocator } from '../Locator.js';

export class ConjurResourceBase {
  readonly id: ConjurLocator;
  readonly owner: ConjurLocator;
  
  constructor(raw: IConjurResource) {
    this.id = ConjurLocator.fromString(raw.id);
    this.owner = ConjurLocator.fromString(raw.owner);
  }
}
