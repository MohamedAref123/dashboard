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

    const payload = this.token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  get permissions(): string[] {
    return this.claims?.permissions || [];
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
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
