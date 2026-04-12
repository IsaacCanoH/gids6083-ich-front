import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoaderService } from "../services/loader.service";
import { finalize } from "rxjs";

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderSvc = inject(LoaderService);

  loaderSvc.show();

  return next(req).pipe(
    finalize(() => {
      loaderSvc.hide();
    })
  );
}
