import { Routes } from '@angular/router';
import { roleGuard } from '../../../iam/application/auth.guard';

const appointmentsCalendar = () => import('../views/appointments-calendar/appointments-calendar').then(m => m.AppointmentsCalendar);
const appointmentForm = () => import('../views/appointment-form/appointment-form').then(m => m.AppointmentForm);
const appointmentsList = () => import('../views/appointments-list/appointments-list').then(m => m.AppointmentsList);
const scheduleManagement = () => import('../views/schedule-management/schedule-management').then(m => m.ScheduleManagement);

export const appointmentsRoutes: Routes = [
  {
    path: 'calendar',
    loadComponent: appointmentsCalendar,
    canActivate: [roleGuard],
    data: { roles: ['Patient', 'Family', 'Doctor', 'Admin'] },
    title: 'CareLink - Appointments Calendar'
  },

  {
    path: 'list',
    loadComponent: appointmentsList,
    canActivate: [roleGuard],
    data: { roles: ['Doctor', 'Admin'] },
    title: 'CareLink - Appointments List'
  },

  {
    path: 'new',
    loadComponent: appointmentForm,
    canActivate: [roleGuard],
    data: { roles: ['Patient', 'Family', 'Doctor', 'Admin'] },
    title: 'CareLink - New Appointment'
  },

  {
    path: 'edit/:id',
    loadComponent: appointmentForm,
    canActivate: [roleGuard],
    data: { roles: ['Doctor', 'Admin'] },
    title: 'CareLink - Edit Appointment'
  },

  {
    path: 'schedules',
    loadComponent: scheduleManagement,
    canActivate: [roleGuard],
    data: { roles: ['Doctor', 'Admin'] },
    title: 'CareLink - Schedule Management'
  },

  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full'
  }
];
