import { ApiPermissionGroup } from '../permissions/permission';

export interface JwtClaims {
  sub: string;
  name: string;
  Permission: string[]; // 👈 مهم
  exp: number;
  iss?: string;
  aud?: string;
}
