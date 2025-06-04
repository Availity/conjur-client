import type { IConjurResourceHost } from '../interfaces/index.js';

import { ConjurResourceBase } from './Base.js';

export class ConjurResourceHost<T extends Record<string, unknown> = Record<string, unknown>> extends ConjurResourceBase {
  readonly annotations: T;
  readonly restrictedTo: Array<string>;
  
  constructor(raw: IConjurResourceHost<T>) {
    super(raw);
    this.annotations = raw.annotations ?? {} as T;
    this.restrictedTo = raw.restricted_to ?? [];
  }
}
