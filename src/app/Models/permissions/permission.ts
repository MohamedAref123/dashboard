export interface ApiPermission {
  value: string;
  name: string;
  checked: boolean;
}

export interface ApiPermissionGroup {
  name: string;
  permissions: ApiPermission[];
}
