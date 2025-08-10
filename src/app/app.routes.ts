import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users').then((m) => m.Users),
  },
  {
    path: 'users/:slug',
    loadComponent: () =>
      import('./pages/user-details/user-details').then((m) => m.UserDetails),
  },
  {
    path: '**',
    redirectTo: '/users',
  },
];
