import { ConjurError } from '../ConjurError.js';

export class ConjurInvalidPolicyRequestError extends ConjurError {
  [Symbol.toStringTag]() {
    return 'ConjurInvalidPolicyRequestError';
  }
}
