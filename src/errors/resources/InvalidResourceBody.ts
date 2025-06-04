import { ConjurError } from '../ConjurError.js';

export class ConjurInvalidResourceBodyError extends ConjurError {
  [Symbol.toStringTag]() {
    return 'ConjurInvalidResourceBodyError';
  }
}
