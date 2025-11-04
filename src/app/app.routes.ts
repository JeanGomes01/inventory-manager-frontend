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
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];
