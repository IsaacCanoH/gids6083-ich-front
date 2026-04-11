import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';

import { AuthApiService } from '../../features/auth/services/auth-api.service';
import { SessionService } from '../services/session.service';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authApiService = inject(AuthApiService);
  const sessionService = inject(SessionService);
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
        return throwError(() => error);
      }

      if (
        isLoginRequest ||
        isRefreshRequest ||
        isLogoutRequest
      ) {
        return throwError(() => error);
      }

      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter((result) => result !== null),
          take(1),
          switchMap((result) => {
            if (result) {
              return next(requestWithCredentials);
            } else {
              return throwError(() => new Error('Refresh failed'));
            }
          })
        );
      } else {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authApiService.refresh().pipe(
          switchMap(() => {
            isRefreshing = false;
            refreshTokenSubject.next(true);
            return next(requestWithCredentials);
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            refreshTokenSubject.next(false);
            sessionService.clearSession();
            if (!isMeRequest) {
              void router.navigate(['/auth/login']);
            }
            return throwError(() => refreshError);
          })
        );
      }
    }),
  );
};

// import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { catchError, switchMap, throwError } from 'rxjs';

// import { AuthApiService } from '../../features/auth/services/auth-api.service';
// import { SessionService } from '../services/session.service';

// export const authInterceptor: HttpInterceptorFn = (request, next) => {
//   const authApiService = inject(AuthApiService);
//   const sessionService = inject(SessionService);
//   const router = inject(Router);

//   const requestWithCredentials = request.clone({
//     withCredentials: true,
//   });

//   const isLoginRequest = request.url.includes('/api/auth/login');
//   const isRefreshRequest = request.url.includes('/api/auth/refresh');
//   const isLogoutRequest = request.url.includes('/api/auth/logout');
//   const isMeRequest = request.url.includes('/api/auth/me');

//   return next(requestWithCredentials).pipe(
//     catchError((error: HttpErrorResponse) => {
//       if (error.status !== 401) {
//         return throwError(() => error);
//       }

//       if (
//         isLoginRequest ||
//         isRefreshRequest ||
//         isLogoutRequest ||
//         isMeRequest
//       ) {
//         return throwError(() => error);
//       }

//       return authApiService.refresh().pipe(
//         switchMap(() => sessionService.loadSession()),
//         switchMap((user) => {
//           if (!user) {
//             sessionService.clearSession();
//             void router.navigate(['/auth/login']);
//             return throwError(() => error);
//           }

//           return next(requestWithCredentials);
//         }),
//         catchError((refreshError) => {
//           sessionService.clearSession();
//           void router.navigate(['/auth/login']);
//           return throwError(() => refreshError);
//         }),
//       );
//     }),
//   );
// };
