import { ConjurError } from '../ConjurError.js';

export class ConjurRoleNotFoundError extends ConjurError {
  [Symbol.toStringTag]() {
    return 'ConjurRoleNotFoundError';
  }
}
