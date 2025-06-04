import type { IConjurResourceUser } from '../interfaces/index.js';

import { ConjurResourceBase } from './Base.js';

export class ConjurResourceUser<T extends Record<string, unknown> = Record<string, unknown>> extends ConjurResourceBase {
  readonly annotations: T;
  readonly restrictedTo: string;
  
  constructor(raw: IConjurResourceUser<T>) {
    super(raw);
    this.annotations = raw.annotations ?? {} as T;
    this.restrictedTo = raw.restricted_to ?? '';
  }
}
