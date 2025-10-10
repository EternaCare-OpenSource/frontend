import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import {IamStore} from '../../../../iam/application/iam.store';
import {MessagingStore} from '../../../../messaging/application/messaging.store';


interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
  private iamStore = inject(IamStore);
  private messagingStore = inject(MessagingStore);
  private router = inject(Router);

  readonly currentUser = this.iamStore.currentUser;
  readonly isAuthenticated = this.iamStore.isAuthenticated;
  readonly unreadMessages = this.messagingStore.unreadCount;

  readonly isSidenavOpen = signal(true);

  readonly menuItems = computed<MenuItem[]>(() => {
    const user = this.currentUser();
    if (!user) return [];

    const roleName = user.role?.name;
    const items: MenuItem[] = [];

    items.push({
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/home'
    });

    if (roleName === 'Patient' || roleName === 'Family') {
      items.push(
        {
          label: 'Stats',
          icon: 'bar_chart',
          route: '/health-monitoring/patient-stats',
          roles: ['Patient', 'Family']
        },
        {
          label: 'Reports',
          icon: 'description',
          route: '/health-monitoring/reports',
          roles: ['Patient', 'Family']
        }
      );
    }

    if (roleName === 'Doctor' || roleName === 'Admin') {
      items.push(
        {
          label: 'Patients',
          icon: 'people',
          route: '/health-monitoring/patients',
          roles: ['Doctor', 'Admin']
        },
        {
          label: 'Doctors',
          icon: 'medical_services',
          route: '/health-monitoring/doctors',
          roles: ['Admin']
        }
      );
    }

    items.push({
      label: 'Messages',
      icon: 'message',
      route: '/messaging/conversations'
    });

    items.push({
      label: 'Appointments',
      icon: 'event',
      route: '/appointments/calendar'
    });

    return items;
  });

  toggleSidenav(): void {
    this.isSidenavOpen.update(value => !value);
  }

  logout(): void {
    this.iamStore.logout();
    this.router.navigate(['/iam/login']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
}
