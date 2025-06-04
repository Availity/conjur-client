import { ConjurError } from '../ConjurError.js';

export class InvalidSecretRequest extends ConjurError {
  [Symbol.toStringTag]() {
    return 'InvalidSecretRequest';
  }
}
