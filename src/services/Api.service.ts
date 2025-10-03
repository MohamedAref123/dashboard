// src/app/core/services/api.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `${environment.baseurl}/${environment.apiVersion}`; // ✅ Replace with your real API base URL
  // ✅ Replace with your real API base URL

  constructor() {}
  http = inject(HttpClient);

  get<T>(
    endpoint: string,
    params?: { [param: string]: string | number | boolean | readonly (string | number | boolean)[] }
  ): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params || {} });

    const token = localStorage.getItem('access_token'); // Or wherever you store it

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      params: httpParams,
      headers
    });
  }

  post<T>(endpoint: string, body: unknown, headers?: HttpHeaders, responseType: 'json' | 'text' = 'json'): Observable<T> {
    let httpHeaders = (headers ?? new HttpHeaders()).set('Content-Type', 'application/json');

    const token = localStorage.getItem('access_token');
    if (token) {
      httpHeaders = httpHeaders.set('Authorization', `Bearer ${token}`);
    }

    if (responseType === 'text') {
      return this.http.post(`${this.baseUrl}/${endpoint}`, body, {
        headers: httpHeaders,
        responseType: 'text'
      }) as unknown as Observable<T>;
    }

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, { headers: httpHeaders });
  }

  put<T>(
    endpoint: string,
    body: unknown, // let Angular stringify automatically
    headers?: HttpHeaders
  ): Observable<T> {
    let httpHeaders = (headers ?? new HttpHeaders()).set('Content-Type', 'application/json');

    const token = localStorage.getItem('access_token');
    if (token) {
      httpHeaders = httpHeaders.set('Authorization', `Bearer ${token}`);
    }

    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, { headers: httpHeaders, responseType: 'text' as 'json' });
  }

  delete<T>(
    endpoint: string,
    params?: { [param: string]: string | number | boolean | readonly (string | number | boolean)[] }
  ): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params || {} });

    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // remove accidental leading `/`
    const cleanEndpoint = endpoint.replace(/^\/+/, '');

    return this.http.delete<T>(`${this.baseUrl}/${cleanEndpoint}`, {
      params: httpParams,
      headers
    });
  }
}
