import type { IConjurResource } from './IConjurResource.js'

export interface IConjurResourceWebService extends IConjurResource {
  id: string;
  owner: string;
}
