export type IConjurTransformer<T> = (value: string) => T;

export interface IConjurLocator<T = string> {
  account: string;
  identifier: string;
  kind: string;
  mapper?: IConjurTransformer<T>;
}

export interface IConjurNaiveLocator extends IConjurLocator {
  account: string;
  identifier: string;
  kind: string;
}

export type IConjurMapping<
  T extends Record<string, unknown> = Record<string, string>,
  K extends string & keyof T = string & keyof T,
  V extends T[K] = T[K]
> = Record<K, IConjurLocator<V>>;

export interface IConjurTransformEntry<
  T extends Record<string, unknown> = Record<string, string>,
  K extends string & keyof T = string & keyof T,
  V extends T[K] = T[K]
> {
  key: K;
  mapper: IConjurTransformer<V>;
}

export type IConjurTransformMap<
  T extends Record<string, unknown> = Record<string, string>,
  K extends string & keyof T = string & keyof T,
  V extends T[K] = T[K],
  S extends Record<string, string> = Record<string, string>
> = Map<string & keyof S, IConjurTransformEntry<T, K, V>>;

export interface IConjurTransformerMappingEntry<
  T extends Record<string, unknown> = Record<string, string>,
  K extends string & keyof T = string & keyof T,
  V extends T[K] = T[K]
> {
  locator: IConjurLocator<V>;
  entry: IConjurTransformEntry<T, K, V>;
}

export type IConjurTransformerMapping<
  T extends Record<string, unknown> = Record<string, string>,
  K extends string & keyof T = string & keyof T,
  V extends T[K] = T[K],
  S extends Record<string, string> = Record<string, string>
> = Map<string & keyof S, IConjurTransformerMappingEntry<T, K, V>>;
