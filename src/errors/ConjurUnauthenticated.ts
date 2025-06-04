import { ConjurError } from './ConjurError.js';

export class ConjurUnauthenticatedError extends ConjurError {
  [Symbol.toStringTag]() {
    return 'ConjurUnauthenticatedError';
  }
}
