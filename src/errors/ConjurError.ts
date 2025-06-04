export class ConjurError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this[Symbol.toStringTag]();
  }
  
  [Symbol.toStringTag]() {
    return 'ConjurError';
  }
}
