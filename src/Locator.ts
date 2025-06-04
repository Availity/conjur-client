import type {
  IConjurLocator,
  IConjurMapping,
  IConjurTransformer,
  IConjurTransformEntry,
  IConjurTransformerMapping
} from './interfaces/index.js';

export class ConjurLocator<
  T extends Record<string, unknown> = Record<string, string>,
  K extends string & keyof T = string & keyof T,
  V extends T[K] = T[K]
> implements IConjurLocator<V> {
  account: string;
  identifier: string;
  kind: string;
  mapper: IConjurTransformer<V>;
  
  constructor(account: string, kind: string, identifier: string, mapper?: IConjurTransformer<V>) {
    this.account = account;
    this.kind = kind;
    this.identifier = identifier;
    this.mapper = mapper ?? ConjurLocator.#defaultMapper as IConjurTransformer<V>;
  }
  
  static #defaultMapper: IConjurTransformer<string> = String;
  
  static fromMapping<
    T extends Record<string, unknown> = Record<string, string>,
    K extends string & keyof T = string & keyof T,
    V extends T[K] = T[K]
  >(mapping: IConjurMapping<T, K, V>): IConjurTransformerMapping<T, K, V> {
    const result: IConjurTransformerMapping<T, K, V> = new Map();
    
    for(const key in mapping) {
      const { account, identifier, kind, mapper } = mapping[key];
      const locator = new ConjurLocator<T, K, V>(account, kind, identifier, mapper);
      const entry: IConjurTransformEntry<T, K, V> = locator.toEntry(key);
      result.set(locator.toString(), { locator, entry });
    }
    
    return result;
  }
  
  static fromString<V>(raw: string, mapper: IConjurTransformer<V> = ConjurLocator.#defaultMapper as IConjurTransformer<V>) {
    const [ account, kind, identifier ] = raw.split(':');
    return new ConjurLocator<Record<string, V>, string, V>(account, kind, identifier, mapper);
  }
  
  toEntry(key: K): IConjurTransformEntry<T, K, V> {
    const { mapper } = this;
    return { key, mapper };
  }
  
  toString() {
    return `${this.account}:${this.kind}:${this.identifier}`;
  }
}
