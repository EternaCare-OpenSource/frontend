import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { HealthMonitoringStore } from '../../../application/health-monitoring.store';
import { Doctor } from '../../../domain/model/doctor.entity';
import { MatDivider } from '@angular/material/divider';

/**
 *
 * Doctors directory page with search, filtering and basic CRUD actions.
 * Uses Angular Signals for reactive state sourced from HealthMonitoringStore.
 */
@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatMenuModule,
    MatDivider
  ],
  templateUrl: './doctors-list.html',
  styleUrls: ['./doctors-list.css']
})
export class DoctorsList{
  /**
   *
   * Store injection providing doctors collection and loading signal.
   */
  private healthMonitoringStore = inject(HealthMonitoringStore);

  /**
   *
   * Reactive sources from the store for doctors and loading state.
   */
  readonly doctors = this.healthMonitoringStore.doctors;
  readonly loading = this.healthMonitoringStore.loading;

  /**
   *
   * User-entered search query used to filter the doctors list.
   */
  readonly searchQuery = signal('');

  /**
   *
   * Computed list of doctors filtered by name, email, specialization, or CMP code.
   */
  readonly filteredDoctors = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.doctors();

    return this.doctors().filter(doctor =>
      doctor.fullName.toLowerCase().includes(query) ||
      doctor.email.toLowerCase().includes(query) ||
      doctor.specialization.toLowerCase().includes(query) ||
      doctor.cmpCode.toLowerCase().includes(query)
    );
  });

  /**
   *
   * Opens a detail view for the selected doctor (placeholder action).
   * @param doctor Doctor to inspect.
   */
  viewDoctorDetails(doctor: Doctor): void {
    console.log('View doctor:', doctor);
  }

  /**
   *
   * Opens edit flow for the selected doctor (placeholder action).
   * @param doctor Doctor to edit.
   */
  editDoctor(doctor: Doctor): void {
    console.log('Edit doctor:', doctor);
  }

  /**
   *
   * Deletes a doctor after a confirmation prompt.
   * @param doctor Doctor entity to remove.
   */
  deleteDoctor(doctor: Doctor): void {
    if (confirm(`Are you sure you want to delete Dr. ${doctor.fullName}?`)) {
      this.healthMonitoringStore.deleteDoctor(doctor.id);
    }
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

  /**
   *
   * Maps a medical specialization to a representative hex color for chips.
   * @param specialization Doctor specialization.
   * @returns Hex color string.
   */
  getSpecializationColor(specialization: string): string {
    const colors: { [key: string]: string } = {
      'Cardiology': '#e91e63',
      'Neurology':  '#9c27b0',
      'Pediatrics': '#4caf50',
      'Geriatrics': '#ff9800',
      'Psychiatry': '#2196f3',
      'General':    '#607d8b'
    };
    return colors[specialization] || '#5eb9d7';
  }
}
