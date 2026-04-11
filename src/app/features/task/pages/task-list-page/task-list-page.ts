import { Task } from './../../models/task.model';
import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TaskApiService } from '../../services/task-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from '../../../../core/services/session.service';
import { filter, finalize } from 'rxjs';
import { Notification } from '../../../../core/components/notification/notification';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoaderService } from '../../../../core/services/loader.service';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterOutlet,Notification],
  templateUrl: './task-list-page.html',
  styleUrl: './task-list-page.css',
})
export class TaskListPage implements OnInit {
  private readonly taskApiSvc = inject(TaskApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sessionSvc = inject(SessionService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly loader = inject(LoaderService);

  readonly tasks = signal<Task[]>([]);
  readonly user = this.sessionSvc.user;

  readonly searchTerm = signal('');
  readonly priorityFilter = signal('');

  readonly currentPage = signal(1);
  readonly pageSize = signal(5);

  readonly filteredTasks = computed(() => {
    const term = this.searchTerm().toLocaleLowerCase().trim();
    const priority = this.priorityFilter();

    return this.tasks().filter((task) => {
      const matchesName = task.name.toLowerCase().includes(term);
      const matchesDescription = task.description.toLowerCase().includes(term);
      const matchesSearch = !term || matchesName || matchesDescription;

      const matchesPriority =
        priority === '' || String(task.priority) === priority;

      return matchesSearch && matchesPriority;
    })
  });

  readonly paginatedTasks = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return this.filteredTasks().slice(start,end);
  });

  readonly totalPages = computed(() => {
    return Math.ceil(this.filteredTasks().length / this.pageSize());
  });

  ngOnInit(): void {
    this.loadTasks();
    this.listenModalClose();
  }

  loadTasks(): void {
    this.loader.show()

    this.taskApiSvc
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks) => {
          this.tasks.set(tasks);
          this.currentPage.set(1);
          this.loader.hide();
        },
        error: () => {
          this.notification.error(
            'Error al cargar tareas',
            'No se pudieron cargar las tareas.'
          );
          this.loader.hide();
        }
      });
  }

  private listenModalClose(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        if (event.urlAfterRedirects === '/tasks') {
          this.loadTasks();
        }
      });
  }

  deleteTask(taskId: number): void {
    const confirmed = window.confirm('¿Seguro que quieres eliminar esta tarea?');

    if (!confirmed) {
      return;
    }

    this.taskApiSvc
      .remove(taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
            this.notification.success(
              'Tarea eliminada',
              'La tarea se eliminó correctamente.'
            );
        },
        error: () => {
          this.notification.error(
            'Error al eliminar tarea',
            'No se pudo eliminar la tarea. Inténtalo nuevamente.'
          );
        }
      })
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onPriorityFilterChange(value: string): void {
    this.priorityFilter.set(value);
    this.currentPage.set(1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }


  logout(): void {
    this.loader.show();

    this.sessionSvc
      .logout()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loader.hide()),
      )
      .subscribe({
        next: () => {
          window.location.href = '/auth/login';
        },
        error: () => {
          this.notification.error(
            'Error al cerrar sesión',
            'No se pudo cerrar la sesión. Inténtalo nuevamente.',
          );
        },
      });
  }
}
