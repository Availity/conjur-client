import { ConjurError } from './ConjurError.js';

export class ConjurForbiddenError extends ConjurError {
  [Symbol.toStringTag]() {
    return 'ConjurForbiddenError';
  }
}
