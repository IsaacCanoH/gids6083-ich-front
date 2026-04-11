import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateUserRequest } from "../models/create-user-request.model";
import { Observable } from "rxjs";
import { CreateUserResponse } from "../models/create-user-response.model";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/user';

  create(payload: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.apiUrl, payload);
  }
}
