import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {

  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data['permission'] as string;

    if (!requiredPermission) {
      return true; // route مش محتاج صلاحية
    }

    if (this.auth.hasPermission(requiredPermission)) {
      return true;
    }

    this.router.navigate(['/permission']);
    return false;
  }
}
