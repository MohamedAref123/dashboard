import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { DoctorClaims } from './Models/shared/system-claims';

export const permissionGuard =
  (requiredPermission: DoctorClaims): CanActivateFn =>
    () => {
      const permissionService = inject(AuthService);
      const router = inject(Router);
      if (permissionService.has(requiredPermission)) {
        return true;
      }

      router.navigate(['/permission']);
      return false;
    };
