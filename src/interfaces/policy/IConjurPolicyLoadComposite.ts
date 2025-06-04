import type { IConjurPolicyLoad } from './IConjurPolicyLoad.js';
import type { IConjurPolicyLoadDryRunSuccess, IConjurPolicyLoadFailure } from './IConjurPolicyLoadDryRun.js';
import type { IConjurPolicyLoadDryRunCollection } from './IConjurPolicyLoadDryRunCollection.js';
import type { IConjurPolicyLoadDryRunError } from './IConjurPolicyLoadDryRunError.js';

export type IConjurPolicyLoadResult<T> =  T extends { version: number }
  ? IConjurPolicyLoad
  : T extends { errors: Array<IConjurPolicyLoadDryRunError> }
    ? IConjurPolicyLoadFailure
    : T extends { created: IConjurPolicyLoadDryRunCollection }
      ? IConjurPolicyLoadDryRunSuccess
      : never;
