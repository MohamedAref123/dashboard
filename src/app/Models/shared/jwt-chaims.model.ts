import { ApiPermissionGroup } from '../permissions/permission';

export interface JwtClaims {
  sub: string;
  name: string;
  permissions: string[]; // 👈 مهم
  exp: number;
  iss?: string;
  aud?: string;
}
