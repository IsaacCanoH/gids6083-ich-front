import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./features/user/user.routes').then(
        (m) => m.USER_ROUTES,
      ),
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./features/task/task.routes').then((m) => m.TASK_ROUTES),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
