import type { IConjurSessionTokenHeader } from './IConjurSessionTokenHeader.js';
import type { IConjurSessionTokenPayload } from './IConjurSessionTokenPayload.js';

export interface IConjurSessionToken {
  protected: IConjurSessionTokenHeader;
  payload: IConjurSessionTokenPayload;
  signature: Buffer;
  
  get isValid(): boolean;
}
