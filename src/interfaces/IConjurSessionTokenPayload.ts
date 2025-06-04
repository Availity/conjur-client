export interface IConjurSessionTokenPayload {
  exp: Date;
  iat: Date;
  sub: string;
  
  get isValid(): boolean;
}
