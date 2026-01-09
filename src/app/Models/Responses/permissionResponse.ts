export interface Permission {
  value: string;
  name: string;
  checked: boolean;
}

export interface Claim {
  name: string;
  permissions: Permission[];
}

export interface UserClaims {
  id: string;
  userName: string;
  customName: string;
  claims: Claim[];
}
