import { Routes } from '@angular/router';
import {roleGuard} from '../../../iam/application/auth.guard';
const patientDashboard = () => import('../views/patient-dashboard/patient-dashboard').then(m => m.PatientDashboard);
const patientProfile = () => import('../views/patient-profile/patient-profile').then(m => m.PatientProfile);
const patientsList = () => import('../views/patients-list/patients-list').then(m => m.PatientsList);
const doctorsList = () => import('../views/doctors-list/doctors-list').then(m => m.DoctorsList);
const reports = () => import('../views/reports/reports').then(m => m.Reports);
const diagnosis = () => import('../views/diagnosis/diagnosis').then(m => m.Diagnosis);

export const healthMonitoringRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: patientDashboard,
    canActivate: [roleGuard],
    data: { roles: ['Patient', 'Family'] },
    title: 'CareLink - Patient Dashboard'
  },

  {
    path: 'patient/:id',
    loadComponent: patientProfile,
    canActivate: [roleGuard],
    data: { roles: ['Patient', 'Family', 'Doctor', 'Admin'] },
    title: 'CareLink - Patient Profile'
  },

  {
    path: 'patients',
    loadComponent: patientsList,
    canActivate: [roleGuard],
    data: { roles: ['Doctor', 'Admin'] },
    title: 'CareLink - Patients List'
  },

  {
    path: 'doctors',
    loadComponent: doctorsList,
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    title: 'CareLink - Doctors List'
  },

  {
    path: 'reports',
    loadComponent: reports,
    canActivate: [roleGuard],
    data: { roles: ['Patient', 'Family', 'Doctor'] },
    title: 'CareLink - Medical Reports'
  },

  {
    path: 'patient-stats',
    loadComponent: patientDashboard,
    canActivate: [roleGuard],
    data: { roles: ['Patient', 'Family'] },
    title: 'CareLink - Patient Stats'
  },

  {
    path: 'diagnosis/:id',
    loadComponent: diagnosis,
    canActivate: [roleGuard],
    data: { roles: ['Doctor', 'Patient', 'Family'] },
    title: 'CareLink - Diagnosis'
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
