import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TaskForm } from '../../components/task-form/task-form';
import { TaskApiService } from '../../services/task-api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Task } from '../../models/task.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UpdateTaskRequest } from '../../models/update-task-request.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { ApiError } from '../../../../core/models/api-error.model';

@Component({
  selector: 'app-task-edit-page',
  standalone: true,
  imports: [CommonModule,TaskForm],
  templateUrl: './task-edit-page.html',
  styleUrl: './task-edit-page.css',
})
export class TaskEditPage implements OnInit {
  private readonly taskApiSvc = inject(TaskApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notification = inject(NotificationService);
  taskId!: number;
  readonly task = signal<Task | null>(null);

  ngOnInit(): void {
    this.getTaskId();
    this.loadTask();
  }

  private getTaskId(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/tasks']);
      return;
    }

    this.taskId = Number(id);
  }

  private loadTask(): void {

    this.taskApiSvc
      .findById(this.taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (task) => {
          this.task.set(task);
        },
        error: (error: ApiError) => {
          this.notification.error(
            'Error al cargar tarea',
            error.message
          );
        }
      });
  }

  onSubmit(data: UpdateTaskRequest): void {

    this.taskApiSvc
      .update(this.taskId,data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void this.router.navigate(['/tasks']);
          this.notification.success(
            'Tarea actualizada',
            'La tarea se actualizó correctamente.'
          );
        },
        error: (error: ApiError) => {
          this.notification.error(
            'Error al actualizar tarea',
            error.message
          );
        }
      });
  }

  close(): void {
    this.router.navigate(['/tasks']);
  }
}
