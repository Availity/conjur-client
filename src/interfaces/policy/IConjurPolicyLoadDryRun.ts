import type {  IConjurPolicyLoadDryRunCollection } from './IConjurPolicyLoadDryRunCollection.js';
import type { IConjurPolicyLoadDryRunError } from './IConjurPolicyLoadDryRunError.js';

export interface IConjurPolicyLoadDryRun<
  C extends IConjurPolicyLoadDryRunCollection | undefined = undefined,
  U extends IConjurPolicyLoadDryRunCollection | undefined = undefined,
  D extends IConjurPolicyLoadDryRunCollection | undefined = undefined,
  E extends Array<IConjurPolicyLoadDryRunError> | undefined = undefined> {
  status: string;
  created: C;
  updated: U;
  deleted: D;
  errors: E;
}

export type IConjurPolicyLoadDryRunSuccess = IConjurPolicyLoadDryRun<
  IConjurPolicyLoadDryRunCollection,
  IConjurPolicyLoadDryRunCollection,
  IConjurPolicyLoadDryRunCollection,
  undefined
>;

export type IConjurPolicyLoadFailure = IConjurPolicyLoadDryRun<
  undefined,
  undefined,
  undefined,
  Array<IConjurPolicyLoadDryRunError>
>;
