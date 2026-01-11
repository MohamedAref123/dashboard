import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtClaims } from 'src/app/Models/shared/jwt-chaims.model';
import { JwtPayload } from 'src/app/Models/shared/SharedClasses';
import { DoctorClaims } from 'src/app/Models/shared/system-claims';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  get claims(): JwtClaims | null {
    if (!this.token) return null;
    try {
      const payload = this.token.split('.')[1];
      return JSON.parse(atob(payload)) as JwtClaims;
    } catch (e) {
      console.error('JWT parsing error', e);
      return null;
    }
  }

  get permissions(): string[] {
    const permisions = this.claims?.Permission;
    return permisions;
  }

  private hasPermission(permission: DoctorClaims): boolean {
    return this.permissions?.includes(permission) ?? false;
  }
  has(permission: DoctorClaims): boolean {
    return this.hasPermission(permission);
  }

  hasAny(permissions: DoctorClaims[]): boolean {
    return permissions.some((p) => this.has(p));
  }

  hasAll(permissions: DoctorClaims[]): boolean {
    return permissions.every((p) => this.has(p));
  }

  getDoctorId(): string | null {
    const token = this.token;
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      // assuming your claim is 'doctorId' or maybe 'sub', 'id', etc.
      return decoded.LoggedId || null;
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  }

  constructor() {}
}
