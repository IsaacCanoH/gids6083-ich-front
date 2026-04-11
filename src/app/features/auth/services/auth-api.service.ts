import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginRequest } from "../models/login-request.model";
import { Observable } from "rxjs";
import { LoginResponse } from "../models/login-response.model";
import { CurrentUser } from "../models/current-user.model";

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/auth';

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload);
  }

  me(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.apiUrl}/me`);
  }

  refresh(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/refresh`,{});
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`,{});
  }
}
