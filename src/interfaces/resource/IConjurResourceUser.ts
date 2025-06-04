import type { IConjurResource } from './IConjurResource.js';

export interface IConjurResourceUser<T extends Record<string, unknown> = Record<string, unknown>> extends IConjurResource {
  annotations?: T;
  id: string;
  owner: string;
  restricted_to?: string;
}
