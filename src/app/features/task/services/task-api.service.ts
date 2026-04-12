import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { Task } from "../models/task.model";
import { CreateTaskRequest } from "../models/create-task-request.model";
import { UpdateTaskRequest } from "../models/update-task-request.model";
import { ErrorHandlerService } from "../../../core/services/error-handler.service";

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/task';
  private readonly errorHandlerSvd = inject(ErrorHandlerService);

  findAll(): Observable<Task[]> {
    return this
      .http.get<Task[]>(this.apiUrl)
      .pipe(catchError((error) => this.errorHandlerSvd.handleHttpError(error)));
  }

  findById(id: number): Observable<Task> {
    return this
      .http.get<Task>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error) => this.errorHandlerSvd.handleHttpError(error)));
  }

  create(payload: CreateTaskRequest): Observable<Task> {
    return this
      .http.post<Task>(this.apiUrl, payload)
      .pipe(catchError((error) => this.errorHandlerSvd.handleHttpError(error)));
  }

  update(id: number, payload: UpdateTaskRequest): Observable<Task> {
    return this
      .http.put<Task>(`${this.apiUrl}/${id}`, payload)
      .pipe(catchError((error) => this.errorHandlerSvd.handleHttpError(error)));
  }

  remove(id: number): Observable<boolean> {
    return this
      .http.delete<boolean>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error) => this.errorHandlerSvd.handleHttpError(error)));
  }
}
