import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const TASK_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/task-list-page/task-list-page').then(
        (m) => m.TaskListPage,
      ),
      children: [
        {
          path: 'create',
          canActivate: [authGuard],
          loadComponent: () =>
            import('./pages/task-create-page/task-create-page').then(
              (m) => m.TaskCreatePage,
            ),
        },
        {
          path: ':id/edit',
          canActivate: [authGuard],
          loadComponent: () =>
            import('./pages/task-edit-page/task-edit-page').then(
              (m) => m.TaskEditPage,
            ),
        },
      ]
  },
];
