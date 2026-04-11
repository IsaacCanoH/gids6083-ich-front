import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Task } from "../models/task.model";
import { CreateTaskRequest } from "../models/create-task-request.model";
import { UpdateTaskRequest } from "../models/update-task-request.model";

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/task';

  findAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  findById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, payload);
  }

  update(id: number, payload: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, payload);
  }

  remove(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
