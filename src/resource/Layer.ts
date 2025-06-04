import type { IConjurResourceLayer } from '../interfaces/index.js';

import { ConjurResourceBase } from './Base.js';

export class ConjurResourceLayer<T extends Record<string, unknown> = Record<string, unknown>> extends ConjurResourceBase {
  readonly annotations: T;
  
  constructor(raw: IConjurResourceLayer<T>) {
    super(raw);
    this.annotations = raw.annotations ?? {} as T;
  }
}
