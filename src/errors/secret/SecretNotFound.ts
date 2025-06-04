import { ConjurError } from '../ConjurError.js';

export class SecretNotFoundError extends ConjurError {
  [Symbol.toStringTag]() {
    return 'SecretNotFoundError';
  }
}
