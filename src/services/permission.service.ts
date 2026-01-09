import { inject, Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { Observable } from 'rxjs';
import { UserClaims } from 'src/app/Models/Responses/permissionResponse';
import { PermissionRequest } from 'src/app/Models/Requests/assignpermissionRequest';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  apiservice = inject(ApiService)


  getpermission(userId: string): Observable<UserClaims> {
    return this.apiservice.get<UserClaims>(
      `Accounts/User-Permissions/${userId}`
    );
  }

  updatepermission(request: PermissionRequest): Observable<UserClaims> {
    return this.apiservice.post<UserClaims>('Accounts/AssignPermissions', request)
  }


}
