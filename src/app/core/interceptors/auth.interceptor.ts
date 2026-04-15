import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';

import { AuthApiService } from '../../features/auth/services/auth-api.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { SessionService } from '../services/session.service';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authApiService = inject(AuthApiService);
  const sessionService = inject(SessionService);
  const errorHandlerService = inject(ErrorHandlerService);
  const router = inject(Router);

  const requestWithCredentials = request.clone({
    withCredentials: true,
  });

  const isLoginRequest = request.url.includes('/api/auth/login');
  const isRefreshRequest = request.url.includes('/api/auth/refresh');
  const isLogoutRequest = request.url.includes('/api/auth/logout');
  const isMeRequest = request.url.includes('/api/auth/me');

  return next(requestWithCredentials).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => errorHandlerService.mapHttpError(error));
      }

      if (isLoginRequest || isRefreshRequest || isLogoutRequest) {
        return throwError(() => errorHandlerService.mapHttpError(error));
      }

      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter((result) => result !== null),
          take(1),
          switchMap((result) => {
            if (result) {
              return next(requestWithCredentials);
            }

            return throwError(() => ({
              status: 401,
              message: 'No autorizado. Inicia sesión nuevamente',
            }));
          }),
        );
      }

      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authApiService.refresh().pipe(
        switchMap(() => {
          isRefreshing = false;
          refreshTokenSubject.next(true);

          return next(requestWithCredentials);
        }),
        catchError((refreshError: HttpErrorResponse) => {
          isRefreshing = false;
          refreshTokenSubject.next(false);
          sessionService.clearSession();

          if (!isMeRequest) {
            void router.navigate(['/auth/login']);
          }

          return throwError(() => errorHandlerService.mapHttpError(refreshError));
        }),
      );
    }),
  );
};
