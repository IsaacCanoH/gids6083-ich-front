import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { SessionService } from "../services/session.service";
import { catchError, map, of } from "rxjs";

export const guestGuard: CanActivateFn = () => {
  const sessionSvc = inject(SessionService);
  const router = inject(Router);

  if (sessionSvc.isAuthenticated()) {
    return router.createUrlTree(['/tasks']);
  }

  return sessionSvc.loadSession().pipe(
    map((user) => {
      if (user) {
        return router.createUrlTree(['/tasks']);
      }

      return true;
    }),
    catchError(() => of(true)),
  );
};
