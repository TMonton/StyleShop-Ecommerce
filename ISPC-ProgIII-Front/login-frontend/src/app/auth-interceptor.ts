import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);

  const access = localStorage.getItem('access');
  const refresh = localStorage.getItem('refresh');

  let authReq = req;

  if (access) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401 && refresh) {
        // 🔥 pedir nuevo access
        return http.post<any>('http://localhost:8000/api/token/refresh/', {
          refresh: refresh
        }).pipe(
          switchMap((res) => {

            localStorage.setItem('access', res.access);

            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.access}`
              }
            });

            return next(newReq);
          })
        );
      }

      return throwError(() => error);
    })
  );
};