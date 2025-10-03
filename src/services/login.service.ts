// src/app/core/services/auth.service.ts
import { inject, Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';
import { ApiService } from './Api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor() {}

  apiService = inject(ApiService);

  public login(email: string, password: string): Observable<string> {
    return this.apiService.post<string>(`Accounts/Login`, JSON.stringify({ userName: email, password: password }), null, 'text').pipe(
      tap((response) => {
        // Store the token in localStorage or sessionStorage
        localStorage.setItem('access_token', response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
