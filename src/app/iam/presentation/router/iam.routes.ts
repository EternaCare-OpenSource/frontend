import { Routes } from '@angular/router';
import {authGuard, publicGuard} from '../../application/auth.guard';

const login = () => import('../views/login/login').then(m => m.Login);
const register = () => import('../views/register/register').then(m => m.Register);
const profile = () => import('../views/profile/profile').then(m => m.Profile);

export const iamRoutes: Routes = [
  {
    path: 'login',
    loadComponent: login,
    canActivate: [publicGuard],
    title: 'CareLink - Login'
  },

  {
    path: 'register',
    loadComponent: register,
    canActivate: [publicGuard],
    title: 'CareLink - Register'
  },
  {
    path: 'profile',
    loadComponent: profile,
    canActivate: [authGuard],
    title: 'CareLink - Register'
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
