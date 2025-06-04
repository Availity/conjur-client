import type { IConjurResource } from './IConjurResource.js';
import type { IConjurResourceGroupAnnotations } from './IConjurResourceGroupAnnotations.js';

export interface IConjurResourceGroup extends IConjurResource {
  id: string;
  owner: string;
  annotations?: IConjurResourceGroupAnnotations;
}
