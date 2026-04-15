import { HttpClient, HttpContext } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginRequest } from "../models/login-request.model";
import { catchError, Observable } from "rxjs";
import { LoginResponse } from "../models/login-response.model";
import { CurrentUser } from "../models/current-user.model";
import { ErrorHandlerService } from "../../../core/services/error-handler.service";
import { environment } from "../../../../environments/environment";
import { AUTH_REQUEST_TYPE } from "../../../core/constants/auth-request-context.constant";

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly errorHandlerSvc = inject(ErrorHandlerService);

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this
      .http.post<LoginResponse>(`${this.apiUrl}/login`, payload, {
        context: new HttpContext().set(AUTH_REQUEST_TYPE, 'login')
      })
      .pipe(catchError((error) => this.errorHandlerSvc.mapHttpError(error)));
  }

  me(): Observable<CurrentUser> {
    return this
      .http.get<CurrentUser>(`${this.apiUrl}/me`, {
        context: new HttpContext().set(AUTH_REQUEST_TYPE, 'me')
      })
      .pipe(catchError((error) => this.errorHandlerSvc.mapHttpError(error)));
  }

  refresh(): Observable<{ message: string }> {
    return this
      .http.post<{ message: string }>(`${this.apiUrl}/refresh`,{}, {
        context: new HttpContext().set(AUTH_REQUEST_TYPE,"refresh")
      })
      .pipe(catchError((error) => this.errorHandlerSvc.mapHttpError(error)));
  }

  logout(): Observable<void> {
    return this
      .http.post<void>(`${this.apiUrl}/logout`,{}, {
        context: new HttpContext().set(AUTH_REQUEST_TYPE, 'logout')
      })
      .pipe(catchError((error) => this.errorHandlerSvc.mapHttpError(error)));
  }
}
