import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { HealthMonitoringStore } from '../../../application/health-monitoring.store';
import { Patient } from '../../../domain/model/patient.entity';
import { MatDivider } from '@angular/material/divider';

/**
 *
 * Patients directory with search, filtering, table display and basic actions.
 * Uses Angular Signals for reactive state sourced from HealthMonitoringStore.
 */
@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatDivider
  ],
  templateUrl: './patients-list.html',
  styleUrls: ['./patients-list.css']
})
export class PatientsList {
  /**
   *
   * Store and router dependencies.
   */
  private healthMonitoringStore = inject(HealthMonitoringStore);
  private router = inject(Router);

  /**
   *
   * Reactive sources from the store for patients and loading state.
   */
  readonly patients = this.healthMonitoringStore.patients;
  readonly loading = this.healthMonitoringStore.loading;

  /**
   *
   * User-entered search query used to filter the patients list.
   */
  readonly searchQuery = signal('');

  /**
   *
   * Computed list of patients filtered by name, email, patientId, or assigned doctor.
   */
  readonly filteredPatients = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.patients();

    return this.patients().filter(patient =>
      patient.fullName.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      patient.patientId.toLowerCase().includes(query) ||
      patient.doctor?.fullName.toLowerCase().includes(query)
    );
  });

  /**
   *
   * Column definitions for the Material table.
   */
  readonly displayedColumns: string[] = [
    'avatar',
    'name',
    'patientId',
    'age',
    'sex',
    'bloodType',
    'assignedDoctor',
    'status',
    'registerDate',
    'actions'
  ];

  /**
   *
   * Navigates to the selected patient's profile page.
   * @param patient Patient to view.
   */
  viewPatientDetails(patient: Patient): void {
    this.router.navigate(['/health-monitoring/patient', patient.id]);
  }

  /**
   *
   * Navigates to the diagnosis page for the selected patient.
   * @param patient Patient to diagnose.
   */
  viewDiagnosis(patient: Patient): void {
    this.router.navigate(['/health-monitoring/diagnosis', patient.id]);
  }

  /**
   *
   * Opens edit flow for the selected patient (placeholder).
   * @param patient Patient to edit.
   */
  editPatient(patient: Patient): void {
    console.log('Edit patient:', patient);
  }

  /**
   *
   * Deletes a patient after a confirmation prompt.
   * @param patient Patient to remove.
   */
  deletePatient(patient: Patient): void {
    if (confirm(`Are you sure you want to delete ${patient.fullName}?`)) {
      this.healthMonitoringStore.deletePatient(patient.id);
    }
  }

  /**
   *
   * Maps a health status to a Material color key for chip styling.
   * @param status Health status label.
   * @returns Material color key ('primary' | 'accent' | 'warn' | '').
   */
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Healthy':  'primary',
      'Critical': 'warn',
      'Warning':  'accent',
      'Stable':   'primary'
    };
    return colors[status] || '';
  }

  /**
   *
   * Derives avatar initials from a full name string.
   * @param name Full name.
   * @returns Two-letter uppercase initials.
   */
  getAvatarInitials(name: string): string {
    const names = name.split(' ');
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  }
}
