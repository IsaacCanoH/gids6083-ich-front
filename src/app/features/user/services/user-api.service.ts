import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateUserRequest } from "../models/create-user-request.model";
import { catchError, Observable } from "rxjs";
import { CreateUserResponse } from "../models/create-user-response.model";
import { ErrorHandlerService } from "../../../core/services/error-handler.service";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/user`;
  private readonly errorHandlerSvc = inject(ErrorHandlerService);

  create(payload: CreateUserRequest): Observable<CreateUserResponse> {
    return this
      .http.post<CreateUserResponse>(this.apiUrl, payload)
      .pipe(catchError((error) => this.errorHandlerSvc.handleHttpError(error)));
  }
}
