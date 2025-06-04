import { ConjurError } from '../ConjurError.js';

export class ConjurPolicyNotFoundError extends ConjurError {
  [Symbol.toStringTag]() {
    return 'ConjurPolicyNotFoundError';
  }
}
