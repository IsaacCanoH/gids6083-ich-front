import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-user-page/register-user-page').then(
        (m) => m.RegisterUserPage,
      ),
  },
];
