import type { IConjurResourcePolicy } from '../interfaces/index.js';

import { ConjurResourceBase } from './Base.js';

export class ConjurResourcePolicy<T extends Array<ConjurResourceBase> = Array<ConjurResourceBase>> extends ConjurResourceBase {
  readonly body: T;
  
  constructor(raw: IConjurResourcePolicy, body: T) {
    super(raw);
    this.body = body;
  }
}
