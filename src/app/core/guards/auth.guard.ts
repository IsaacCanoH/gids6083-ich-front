import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { SessionService } from "../services/session.service";
import { catchError, map, of } from "rxjs";
import { ErrorHandlerService } from "../services/error-handler.service";

export const authGuard: CanActivateFn = () => {
  const sessionSvc = inject(SessionService);
  const router = inject(Router);
  const errorHandlerSvc = inject(ErrorHandlerService);

  if (sessionSvc.isAuthenticated()) {
    return true;
  }

  return sessionSvc.loadSession().pipe(
    map((user) => {
      if (user) {
        return true;
      }

      return router.createUrlTree(['/auth/login']);
    }),
    catchError((error) => {
      errorHandlerSvc.mapHttpError(error)
      return of(router.createUrlTree(['/auth/login']))
    })
  );
};
