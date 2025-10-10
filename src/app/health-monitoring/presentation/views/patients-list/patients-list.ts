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
import {HealthMonitoringStore} from '../../../application/health-monitoring.store';
import {Patient} from '../../../domain/model/patient.entity';
import {MatDivider} from '@angular/material/divider';


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
  private healthMonitoringStore = inject(HealthMonitoringStore);
  private router = inject(Router);

  readonly patients = this.healthMonitoringStore.patients;
  readonly loading = this.healthMonitoringStore.loading;
  readonly searchQuery = signal('');

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

  viewPatientDetails(patient: Patient): void {
    this.router.navigate(['/health-monitoring/patient', patient.id]);
  }

  viewDiagnosis(patient: Patient): void {
    this.router.navigate(['/health-monitoring/diagnosis', patient.id]);
  }

  editPatient(patient: Patient): void {
    console.log('Edit patient:', patient);
  }

  deletePatient(patient: Patient): void {
    if (confirm(`Are you sure you want to delete ${patient.fullName}?`)) {
      this.healthMonitoringStore.deletePatient(patient.id);
    }
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Healthy': 'primary',
      'Critical': 'warn',
      'Warning': 'accent',
      'Stable': 'primary'
    };
    return colors[status] || '';
  }

  getAvatarInitials(name: string): string {
    const names = name.split(' ');
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  }
}
