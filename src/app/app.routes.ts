import { Routes } from '@angular/router';
import { Login } from './modules/auth/login/login';
import { Layout } from './modules/layout/layout';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },

  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./modules/home/home').then((c) => c.Home),
      },
    ],
  },
];
