import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionRequest } from 'src/app/Models/Requests/assignpermissionRequest';
import { UserClaims } from 'src/app/Models/Responses/permissionResponse';
import { PermissionService } from 'src/services/permission.service';
import { ToastService } from 'src/services/ToastService';
import { ClaimTranslatePipe } from "../../shared/pipes/claim-translate-pipe";


@Component({
  selector: 'app-user-permission',
  imports: [NgFor, NgIf, CommonModule, FormsModule, TranslateModule, ClaimTranslatePipe],
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit {

  route = inject(ActivatedRoute);
  permissionService = inject(PermissionService);
  toast = inject(ToastService)
  permission!: UserClaims;



  ngOnInit(): void {
    this.getPermission();
  }

  getPermission() {
    const subId = this.route.snapshot.paramMap.get('subuserID') ?? '';

    this.permissionService.getpermission(subId).subscribe({
      next: (res) => {
        this.permission = res;
        console.log(res);

      },
      error: (err) => {
        console.error('Permission API error', err);

      }
    });
  }

  savePermissions() {
    if (!this.permission) return;



    // جمع الـ permissions المفعلة فقط
    const activePermissions = this.permission.claims.flatMap(claim =>
      claim.permissions
        .filter(perm => perm.checked)
        .map(perm => perm.value)
    );

    const request: PermissionRequest = {
      userId: this.permission.id,
      permissions: activePermissions
    };

    this.permissionService.updatepermission(request).subscribe({
      next: (res) => {
        console.log('Permissions updated successfully', res);
        this.toast.success('Permissions updated successfully ');

      },
      error: (err) => {
        console.error('Error updating permissions', err);
        this.toast.error('Failed to update permissions ❌');

      }
    });
  }

}
