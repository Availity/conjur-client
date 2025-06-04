import type { IConjurClient } from './interfaces/index.js';

export class ConjurApi {
  readonly client: IConjurClient;
  
  constructor(client: IConjurClient) {
    this.client = client;
  }
}
