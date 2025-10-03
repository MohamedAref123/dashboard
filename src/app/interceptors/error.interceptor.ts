// src/app/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastService } from 'src/services/ToastService';
import { ErrorResponse } from '../Models/Responses/ErrorResponse';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('API call failed:', error);

      let errorMsg = "An unexpected error occurred.";

      // Prefer backend-provided message if available
      if (error.error && typeof error.error === 'object') {
        errorMsg = error.error.message || errorMsg;
      } else if (typeof error.error === 'string') {
        const obj: ErrorResponse = JSON.parse(error.error);
        errorMsg = obj.message;
      }

      // Handle 401 separately (session expired)
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
        toast.error("Session expired. Please login again.", 5000);
      } else {
        toast.error(errorMsg, 5000);
      }

      return throwError(() => error);
    })
  );
};
