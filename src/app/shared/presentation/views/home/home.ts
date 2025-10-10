import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import {IamStore} from '../../../../iam/application/iam.store';
import {HealthMonitoringStore} from '../../../../health-monitoring/application/health-monitoring.store';
import {AppointmentsStore} from '../../../../appointments/application/appointments.store';
import {MessagingStore} from '../../../../messaging/application/messaging.store';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  private iamStore = inject(IamStore);
  private healthMonitoringStore = inject(HealthMonitoringStore);
  private appointmentsStore = inject(AppointmentsStore);
  private messagingStore = inject(MessagingStore);

  readonly currentUser = this.iamStore.currentUser;
  readonly patientCount = this.healthMonitoringStore.patientCount;
  readonly doctorCount = this.healthMonitoringStore.doctorCount;
  readonly appointmentCount = this.appointmentsStore.appointmentCount;
  readonly unreadMessages = this.messagingStore.unreadCount;

  readonly dashboardCards = computed(() => {
    const user = this.currentUser();
    const role = user?.role?.name;

    if (role === 'Admin' || role === 'Doctor') {
      return [
        {
          title: 'Patients',
          count: this.patientCount(),
          icon: 'people',
          color: '#5eb9d7',
          route: '/health-monitoring/patients'
        },
        {
          title: 'Doctors',
          count: this.doctorCount(),
          icon: 'medical_services',
          color: '#4caf50',
          route: '/health-monitoring/doctors'
        },
        {
          title: 'Appointments',
          count: this.appointmentCount(),
          icon: 'event',
          color: '#ff9800',
          route: '/appointments/calendar'
        },
        {
          title: 'Messages',
          count: this.unreadMessages(),
          icon: 'message',
          color: '#f44336',
          route: '/messaging/conversations'
        }
      ];
    }

    return [
      {
        title: 'My Health',
        count: '',
        icon: 'favorite',
        color: '#e91e63',
        route: '/health-monitoring/dashboard'
      },
      {
        title: 'Reports',
        count: '',
        icon: 'description',
        color: '#9c27b0',
        route: '/health-monitoring/reports'
      },
      {
        title: 'Appointments',
        count: this.appointmentCount(),
        icon: 'event',
        color: '#ff9800',
        route: '/appointments/calendar'
      },
      {
        title: 'Messages',
        count: this.unreadMessages(),
        icon: 'message',
        color: '#f44336',
        route: '/messaging/conversations'
      }
    ];
  });

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}
