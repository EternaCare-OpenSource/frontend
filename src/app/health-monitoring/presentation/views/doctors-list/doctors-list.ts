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
import {HealthMonitoringStore} from '../../../application/health-monitoring.store';
import {Doctor} from '../../../domain/model/doctor.entity';
import {MatDivider} from '@angular/material/divider';


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
  private healthMonitoringStore = inject(HealthMonitoringStore);

  readonly doctors = this.healthMonitoringStore.doctors;
  readonly loading = this.healthMonitoringStore.loading;
  readonly searchQuery = signal('');

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

  viewDoctorDetails(doctor: Doctor): void {
    console.log('View doctor:', doctor);
  }

  editDoctor(doctor: Doctor): void {
    console.log('Edit doctor:', doctor);
  }

  deleteDoctor(doctor: Doctor): void {
    if (confirm(`Are you sure you want to delete Dr. ${doctor.fullName}?`)) {
      this.healthMonitoringStore.deleteDoctor(doctor.id);
    }
  }

  getAvatarInitials(name: string): string {
    const names = name.split(' ');
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  }

  getSpecializationColor(specialization: string): string {
    const colors: { [key: string]: string } = {
      'Cardiology': '#e91e63',
      'Neurology': '#9c27b0',
      'Pediatrics': '#4caf50',
      'Geriatrics': '#ff9800',
      'Psychiatry': '#2196f3',
      'General': '#607d8b'
    };
    return colors[specialization] || '#5eb9d7';
  }
}
