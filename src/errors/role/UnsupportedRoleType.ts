import { ConjurError } from '../ConjurError.js';

export class ConjurUnsupportedRoleTypeError extends ConjurError {
  [Symbol.toStringTag]() {
    return 'ConjurUnsupportedRoleTypeError';
  }
}
