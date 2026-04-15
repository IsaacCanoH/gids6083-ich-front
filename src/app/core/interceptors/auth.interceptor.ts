import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AUTH_REQUEST_TYPE } from '../constants/auth-request-context.constant';
import { ErrorHandlerService } from '../services/error-handler.service';
import { AuthRefreshCoordinatorService } from '../services/auth-refresh-coordinator.service';
import { SessionService } from '../services/session.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const sessionService = inject(SessionService);
  const errorHandlerService = inject(ErrorHandlerService);
  const authRefreshCoordinator = inject(AuthRefreshCoordinatorService);
  const router = inject(Router);
  const requestType = request.context.get(AUTH_REQUEST_TYPE);

  const requestWithCredentials = request.clone({
    withCredentials: true,
  });

  return next(requestWithCredentials).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error no es 401, no es un problema de sesión expirada.
      if (error.status !== 401) {
        return errorHandlerService.mapHttpError(error);
      }
      // Estas requests no deben intentar refresh
      const shouldSkipRefresh =
        requestType === 'login' ||
        requestType === 'refresh' ||
        requestType === 'logout';

      if (shouldSkipRefresh) {
        return errorHandlerService.mapHttpError(error);
      }
      // Si hay un refresh en curso, esta request no inicia otro.
      if (authRefreshCoordinator.isRefreshInProgress()) {
        return authRefreshCoordinator.waitForRefreshResult(() =>
          next(requestWithCredentials),
        );
      }
      // Si no hay un refresh en curso, esta request lo inicia.
      return authRefreshCoordinator.refreshAndRetry(() =>
        next(requestWithCredentials),
      ).pipe(
        catchError((refreshError: HttpErrorResponse) => {
          // Si el refresh falla, no se recupera al sesión.
          sessionService.clearSession();
          // Si la request original no era /me, redirige al login.
          if (requestType !== 'me') {
            void router.navigate(['/auth/login']);
          }

          return errorHandlerService.mapHttpError(refreshError);
        }),
      );
    }),
  );
};
