import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IamStore } from '../../../../iam/application/iam.store';
import { HealthMonitoringStore } from '../../../application/health-monitoring.store';

/**
 *
 * Patient dashboard showing vitals, meds, activities, assigned doctor and quick actions.
 * Uses Angular Signals and computed selectors bound to IAM and HealthMonitoring stores.
 */
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
  /**
   *
   * Store and router dependencies.
   */
  private iamStore = inject(IamStore);
  private healthMonitoringStore = inject(HealthMonitoringStore);
  private router = inject(Router);

  /**
   *
   * Currently authenticated user from IAM store.
   */
  readonly currentUser = this.iamStore.currentUser;

  /**
   *
   * Resolves the patient entity for the current user (by email).
   */
  readonly currentPatient = computed(() => {
    const user = this.currentUser();
    if (!user) return null;
    return this.healthMonitoringStore.patients().find(p => p.email === user.email) || null;
  });

  /**
   *
   * Assigned primary doctor for the current patient, or null if none.
   */
  readonly assignedDoctor = computed(() => {
    const patient = this.currentPatient();
    return patient?.doctor || null;
  });

  /**
   *
   * Latest vital signs snapshot displayed as KPI cards.
   */
  readonly vitalSigns = signal({
    heartRate: 72,
    bloodPressure: '120/80',
    glucose: 95,
    water: 1.5,
    temperature: 36.8,
    oxygen: 98
  });

  /**
   *
   * Recent medications with taken status for quick review.
   */
  readonly medications = signal([
    { name: 'Aspirin',    time: '10 Dec, 2020', taken: true  },
    { name: 'Metformin',  time: '10 Dec, 2020', taken: false },
    { name: 'Lisinopril', time: '10 Dec, 2020', taken: true  }
  ]);

  /**
   *
   * Recent activities related to care interactions.
   */
  readonly recentActivities = signal([
    { title: 'Doctor Watson', subtitle: 'Charge',  icon: 'person',          color: '#5eb9d7' },
    { title: 'Hospital',      subtitle: 'Details', icon: 'local_hospital',  color: '#4caf50' }
  ]);

  /**
   *
   * Physician recommendations or care instructions.
   */
  readonly recommendations = signal(
    'The patient takes one tablet with a glass of water every morning before breakfast to help manage their condition.'
  );

  /**
   *
   * Emotion metrics to visualize mental-wellbeing signals.
   */
  readonly emotionsData = signal([
    { label: 'H', value: 75, emotion: 'Happiness' },
    { label: 'S', value: 45, emotion: 'Sadness'   },
    { label: 'A', value: 60, emotion: 'Anger'     },
    { label: 'J', value: 85, emotion: 'Joy'       },
    { label: 'F', value: 30, emotion: 'Fear'      },
    { label: 'D', value: 40, emotion: 'Depression'}
  ]);

  /**
   *
   * Navigates to the health reports section.
   */
  navigateToReports(): void {
    this.router.navigate(['/health-monitoring/reports']);
  }

  /**
   *
   * Navigates to the diagnosis page for the current patient.
   */
  navigateToDiagnosis(): void {
    const patient = this.currentPatient();
    if (patient) {
      this.router.navigate(['/health-monitoring/diagnosis', patient.id]);
    }
  }

  /**
   *
   * Triggers a file download flow for the selected report (placeholder).
   * @param reportName Report display name to download.
   */
  downloadReport(reportName: string): void {
    console.log('Downloading report:', reportName);
  }

  /**
   *
   * Maps a health status keyword to a hex color for UI indicators.
   * @param status Health status label.
   * @returns Hex color string.
   */
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Healthy':  '#4caf50',
      'Critical': '#f44336',
      'Warning':  '#ff9800',
      'Stable':   '#2196f3'
    };
    return colors[status] || '#999';
  }

  /**
   *
   * Returns the URL of the patient avatar image.
   * @returns Avatar image URL.
   */
  getAvatarUrl(): string {
    return 'https://i.postimg.cc/SNzT4wfK/image.png';
  }
}
