export interface IConjurClient {
  readonly conjurUrl: URL;
  
  submit(url: URL, request: RequestInit): Promise<Response>;
}
