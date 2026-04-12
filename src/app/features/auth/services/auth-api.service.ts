import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginRequest } from "../models/login-request.model";
import { catchError, Observable } from "rxjs";
import { LoginResponse } from "../models/login-response.model";
import { CurrentUser } from "../models/current-user.model";
import { ErrorHandlerService } from "../../../core/services/error-handler.service";

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private readonly errorHandlerSvc = inject(ErrorHandlerService);

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this
      .http.post<LoginResponse>(`${this.apiUrl}/login`, payload)
      .pipe(catchError((error) => this.errorHandlerSvc.handleHttpError(error)));
  }

  me(): Observable<CurrentUser> {
    return this
      .http.get<CurrentUser>(`${this.apiUrl}/me`)
      .pipe(catchError((error) => this.errorHandlerSvc.handleHttpError(error)));
  }

  refresh(): Observable<{ message: string }> {
    return this
      .http.post<{ message: string }>(`${this.apiUrl}/refresh`,{})
      .pipe(catchError((error) => this.errorHandlerSvc.handleHttpError(error)));
  }

  logout(): Observable<void> {
    return this
      .http.post<void>(`${this.apiUrl}/logout`,{})
      .pipe(catchError((error) => this.errorHandlerSvc.handleHttpError(error)));
  }
}
