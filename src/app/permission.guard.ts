import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  private auth = inject(AuthService);
  private router = inject(Router);


  canActivate(route: ActivatedRouteSnapshot): boolean {

    console.log('Role:', this.auth.role);
    console.log('JWT Permissions:', this.auth.permissions);
    console.log('Route required:', route.data['permissions']);

    if (this.auth.isDoctor()) return true;

    if (this.auth.isSubUser()) {
      const requiredPermissions = route.data['permissions'] as string[] | undefined;

      if (!requiredPermissions?.length) {
        this.router.navigate(['/permission']);
        return false;
      }

      const allowed = requiredPermissions.some(p => this.auth.hasPermission(p));
      console.log('SubUser allowed:', allowed);
      if (allowed) return true;

      this.router.navigate(['/permission']);
      return false;
    }

    this.router.navigate(['/permission']);
    return false;
  }

}
