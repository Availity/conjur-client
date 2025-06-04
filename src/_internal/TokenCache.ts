import type { IConjurSessionToken } from '../interfaces/index.js';
import { ConjurSessionToken } from '../token/index.js';

export class TokenCache {
  private readonly cache: Map<string, ConjurSessionToken>;
  static readonly timeouts: Array<NodeJS.Timeout> = [];
  
  constructor(cache?: Map<string, ConjurSessionToken>) {
    this.cache = cache ?? new Map();
  }
  
  add(token: ConjurSessionToken): this {
    if(token.isValid) {
      const key = token.signature.toString('base64url');
      this.cache.set(key, token);
      const id = setTimeout(Map.prototype.delete.bind(this.cache, key), token.ttl);
      TokenCache.timeouts.push(id);
    }
    
    return this;
  }
  
  close(): void {
    TokenCache.timeouts.forEach(clearTimeout);
  }
  
  validate(rawToken: IConjurSessionToken | string): boolean {
    const token = typeof rawToken === 'string' ?
      new ConjurSessionToken(rawToken) :
      rawToken;
    
    return this.cache.has(token.signature.toString('base64url'));
  }
}
