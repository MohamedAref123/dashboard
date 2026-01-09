export interface JwtClaims {
  sub: string;
  name: string;
  role: string;
  permissions: string[];
  exp: number;
  iss?: string;
  aud?: string;
}
