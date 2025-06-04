import type { IConjurResourceGroup, IConjurResourceGroupAnnotations } from '../interfaces/index.js';

import { ConjurResourceBase } from './Base.js';

export class ConjurResourceGroup extends ConjurResourceBase {
  readonly annotations: IConjurResourceGroupAnnotations;
  
  constructor(raw: IConjurResourceGroup) {
    super(raw);
    this.annotations = raw.annotations ?? {} as IConjurResourceGroupAnnotations;
  }
}
