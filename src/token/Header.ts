import type { IConjurSessionTokenHeader } from '../interfaces/index.js';

export class ConjurSessionTokenHeader implements IConjurSessionTokenHeader {
  readonly alg: string;
  readonly kid: string;
  private readonly raw: IConjurSessionTokenHeader;
  
  constructor(raw: IConjurSessionTokenHeader) {
    this.raw = raw;
    this.alg = raw.alg;
    this.kid = raw.kid;
  }

  toString() {
    return btoa(JSON.stringify(this.raw));
  }
}
