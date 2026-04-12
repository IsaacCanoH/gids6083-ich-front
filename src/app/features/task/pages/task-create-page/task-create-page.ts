import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskForm } from '../../components/task-form/task-form';
import { TaskApiService } from '../../services/task-api.service';
import { CreateTaskRequest } from '../../models/create-task-request.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../../core/services/notification.service';
import { ApiError } from '../../../../core/models/api-error.model';

@Component({
  selector: 'app-task-create-page',
  standalone: true,
  imports: [CommonModule,TaskForm],
  templateUrl: './task-create-page.html',
  styleUrl: './task-create-page.css',
})
export class TaskCreatePage {
  private readonly taskApiSvc = inject(TaskApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notification = inject(NotificationService);

  onSubmit(data: CreateTaskRequest): void {

    this.taskApiSvc
      .create(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void this.router.navigate(['/tasks']);
          this.notification.success(
            'Tarea creada',
            'La tarea se creó correctamente.'
          )
        },
        error: (error: ApiError) => {
          this.notification.error(
            'Error al crear tarea',
            error.message
          );
        }
      });
  }

  close(): void {
    void this.router.navigate(['/tasks']);
  }
}
