import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoaderService } from "../services/loader.service";
import { finalize } from "rxjs";

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderSvc = inject(LoaderService);

  let shouldShowLoader = false;
  let delayTimeout: ReturnType<typeof setTimeout> | null = setTimeout(() => {
    loaderSvc.show();
    shouldShowLoader = true;
  }, 5000);

  return next(req).pipe(
    finalize(() => {
      if (delayTimeout) {
        clearTimeout(delayTimeout);
        delayTimeout = null;
      }

      if (shouldShowLoader) {
        loaderSvc.hide();
      }
    })
  );
}
