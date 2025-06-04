import type { IConjurResourceWebService } from '../interfaces/index.js';

import { ConjurResourceBase } from './Base.js';

export class ConjurResourceWebService extends ConjurResourceBase {
  // biome-ignore lint/complexity/noUselessConstructor: documentation incomplete, unable to implement further
  constructor(raw: IConjurResourceWebService) {
    super(raw);
  }
}
