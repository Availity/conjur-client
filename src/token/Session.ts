import { StringExt } from '../_internal/index.js';

import type {
  IConjurSessionToken,
  IConjurSessionTokenRaw,
  IConjurSessionTokenHeader,
  IConjurSessionTokenPayload,
  IConjurSessionTokenPayloadRaw,
  SupportedEncoding
} from '../interfaces/index.js';

import { ConjurSessionTokenHeader } from './Header.js';
import { ConjurSessionTokenPayload } from './Payload.js';

export class ConjurSessionToken implements IConjurSessionToken {
  readonly payload: IConjurSessionTokenPayload;
  readonly protected: IConjurSessionTokenHeader;
  readonly signature: Buffer;
  
  constructor(token: string) {
    const { protected: header, payload, signature } = ConjurSessionToken.#parseEncodedJson<IConjurSessionTokenRaw>(token);
    const rawPayload = ConjurSessionToken.#parseEncodedJson<IConjurSessionTokenPayloadRaw>(payload);
    const rawHeader = ConjurSessionToken.#parseEncodedJson<IConjurSessionTokenHeader>(header);
    
    this.payload = new ConjurSessionTokenPayload(rawPayload);
    this.protected = new ConjurSessionTokenHeader(rawHeader);
    this.signature = Buffer.from(signature, 'base64');
  }
  
  get isValid() {
    return this.payload.isValid;
  }

  static #parseEncodedJson<T>(value: string): T {
    return JSON.parse(atob(value)) as T;
  }

  toJSON(): IConjurSessionTokenRaw {
    const result: IConjurSessionTokenRaw = {
      payload: this.payload.toString(),
      protected: this.protected.toString(),
      signature: this.signature.toString('base64')
    };

    return result;
  }

  toString(encoding: SupportedEncoding = 'base64url'): string {
    return new StringExt(JSON.stringify(this)).toString(encoding);
  }
  
  get ttl() {
    return this.payload.exp.valueOf() - Date.now();
  }
}
