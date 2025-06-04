import type { IConjurResource } from './IConjurResource.js';

export interface IConjurResourcePolicy extends IConjurResource {
  body?: Array<IConjurResource>;
  id: string;
  owner: string;
}
