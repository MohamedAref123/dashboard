// src/app/core/loader.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Loaderservice } from 'src/services/loaderservice';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(Loaderservice);

  loader.show(); // 👈 start spinner
  return next(req).pipe(
    finalize(() => loader.hide()) // 👈 stop spinner
  );
};
