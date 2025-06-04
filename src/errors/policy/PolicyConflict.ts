import { ConjurError } from '../ConjurError.js';

export class ConjurPolicyConflictError extends ConjurError {
  [Symbol.toStringTag]() {
    return 'ConjurPolicyConflictError';
  }
}
