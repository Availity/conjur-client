import { ConjurError } from '../ConjurError.js';

export class ConjurResourceNotFoundError extends ConjurError {
  [Symbol.toStringTag]() {
    return 'ConjurResourceNotFoundError';
  }
}
