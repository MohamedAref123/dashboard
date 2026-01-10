import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtClaims } from 'src/app/Models/shared/jwt-chaims.model';
import { JwtPayload } from 'src/app/Models/shared/SharedClasses';

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
    const groups = this.claims?.permissions;
    if (!groups) return [];

    return groups.flatMap(group =>
      group.permissions
        .filter(p => p.checked)   // ✅ هنا فقط الـ checked = true
        .map(p => `${group.name}|${p.name}`)
    );
  }






  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }



  get role(): string | null {
    return this.claims?.role || null;
  }

  isDoctor(): boolean {
    return this.role === 'Doctor';
  }

  isSubUser(): boolean {
    return this.role === 'SubUser';
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


  constructor() { }
}
