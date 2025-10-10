import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import {IamStore} from '../../../../iam/application/iam.store';
import {HealthMonitoringStore} from '../../../application/health-monitoring.store';


@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './patient-dashboard.html',
  styleUrls: ['./patient-dashboard.css']
})
export class PatientDashboard {
  private iamStore = inject(IamStore);
  private healthMonitoringStore = inject(HealthMonitoringStore);
  private router = inject(Router);

  readonly currentUser = this.iamStore.currentUser;

  readonly currentPatient = computed(() => {
    const user = this.currentUser();
    if (!user) return null;

    return this.healthMonitoringStore.patients().find(p => p.email === user.email);
  });

  readonly assignedDoctor = computed(() => {
    const patient = this.currentPatient();
    return patient?.doctor || null;
  });

  readonly vitalSigns = signal({
    heartRate: 72,
    bloodPressure: '120/80',
    glucose: 95,
    water: 1.5,
    temperature: 36.8,
    oxygen: 98
  });

  readonly medications = signal([
    { name: 'Aspirin', time: '10 Dec, 2020', taken: true },
    { name: 'Metformin', time: '10 Dec, 2020', taken: false },
    { name: 'Lisinopril', time: '10 Dec, 2020', taken: true }
  ]);

  readonly recentActivities = signal([
    { title: 'Doctor Watson', subtitle: 'Charge', icon: 'person', color: '#5eb9d7' },
    { title: 'Hospital', subtitle: 'Details', icon: 'local_hospital', color: '#4caf50' }
  ]);

  readonly recommendations = signal(
    'The patient takes one tablet with a glass of water every morning before breakfast to help manage their condition.'
  );

  readonly emotionsData = signal([
    { label: 'H', value: 75, emotion: 'Happiness' },
    { label: 'S', value: 45, emotion: 'Sadness' },
    { label: 'A', value: 60, emotion: 'Anger' },
    { label: 'J', value: 85, emotion: 'Joy' },
    { label: 'F', value: 30, emotion: 'Fear' },
    { label: 'D', value: 40, emotion: 'Depression' }
  ]);

  navigateToReports(): void {
    this.router.navigate(['/health-monitoring/reports']);
  }

  navigateToDiagnosis(): void {
    const patient = this.currentPatient();
    if (patient) {
      this.router.navigate(['/health-monitoring/diagnosis', patient.id]);
    }
  }

  downloadReport(reportName: string): void {
    console.log('Downloading report:', reportName);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Healthy': '#4caf50',
      'Critical': '#f44336',
      'Warning': '#ff9800',
      'Stable': '#2196f3'
    };
    return colors[status] || '#999';
  }

  getAvatarUrl(): string {
    return 'https://i.postimg.cc/SNzT4wfK/image.png';
  }
}
