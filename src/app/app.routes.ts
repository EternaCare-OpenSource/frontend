import {Routes} from '@angular/router';
import {Home} from './shared/presentation/views/home/home';
import {authGuard} from './iam/application/auth.guard';

const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);
const accessDenied = () => import('./shared/presentation/views/access-denied/access-denied').then(m => m.AccessDenied);

const baseTitle = 'CareLink';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
    title: `${baseTitle} - Home`
  },

  {
    path: 'health-monitoring',
    loadChildren: () => import('./health-monitoring/presentation/router/health-monitoring.routes').then(m => m.healthMonitoringRoutes),
    canActivate: [authGuard],
    title: `${baseTitle} - Health Monitoring`
  },

  {
    path: 'iam',
    loadChildren: () => import('./iam/presentation/router/iam.routes').then(m => m.iamRoutes),
    title: `${baseTitle} - Account`
  },

  {
    path: 'appointments',
    loadChildren: () => import('./appointments/presentation/router/appointments.routes').then(m => m.appointmentsRoutes),
    canActivate: [authGuard],
    title: `${baseTitle} - Appointments`
  },

  {
    path: 'messaging',
    loadChildren: () => import('./messaging/presentation/router/messaging.routes').then(m => m.messagingRoutes),
    canActivate: [authGuard],
    title: `${baseTitle} - Messaging`
  },

  {
    path: 'access-denied',
    loadComponent: accessDenied,
    title: `${baseTitle} - Access Denied`
  },

  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  {
    path: '**',
    loadComponent: pageNotFound,
    title: `${baseTitle} - Page Not Found`
  }
];
