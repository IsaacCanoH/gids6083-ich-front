import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateUserRequest } from "../models/create-user-request.model";
import { Observable } from "rxjs";
import { CreateUserResponse } from "../models/create-user-response.model";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/user`;

  create(payload: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.apiUrl, payload)
  }

  checkUsername(username: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-username/${username}`)
  }
}
