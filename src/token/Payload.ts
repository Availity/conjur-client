import type { IConjurSessionTokenPayload, IConjurSessionTokenPayloadRaw } from '../interfaces/index.js';

export class ConjurSessionTokenPayload implements IConjurSessionTokenPayload {
  readonly exp: Date;
  readonly iat: Date;
  private readonly raw: IConjurSessionTokenPayloadRaw;
  readonly sub: string;

  constructor(raw: IConjurSessionTokenPayloadRaw) {
    this.exp = new Date(raw.exp * 1000);
    this.iat = new Date(raw.iat * 1000);
    this.raw = raw;
    this.sub = raw.sub;
  }
  
  get isValid() {
    return this.exp > new Date();
  }

  toString() {
    return btoa(JSON.stringify(this.raw));
  }
}
