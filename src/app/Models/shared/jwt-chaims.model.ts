import { ApiPermissionGroup } from "../permissions/permission";

export interface JwtClaims {
  sub: string;
  name: string;
  role: 'Doctor' | 'SubUser';
  permissions: ApiPermissionGroup[];   // 👈 مهم
  exp: number;
  iss?: string;
  aud?: string;
}
