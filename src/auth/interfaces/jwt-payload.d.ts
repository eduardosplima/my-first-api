export interface JwtPayload {
  iat: Date;
  exp: Date;
  sub: string;
  jti: string;
}
