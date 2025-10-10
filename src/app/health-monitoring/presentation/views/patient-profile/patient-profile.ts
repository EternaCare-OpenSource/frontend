// patient-profile.ts
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { HealthMonitoringStore } from '../../../application/health-monitoring.store';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule
  ],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css'
})
export class PatientProfile implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private healthMonitoringStore = inject(HealthMonitoringStore);

  readonly patientId = signal<number>(0);

  readonly patient = computed(() => {
    const id = this.patientId();
    return this.healthMonitoringStore.getPatientById(id)();
  });

  readonly assignedDoctor = computed(() => {
    return this.patient()?.doctor || null;
  });

  readonly medicalHistory = signal([
    { condition: 'Hypertension', diagnosedDate: '2020-03-15', status: 'Chronic', severity: 'Moderate' },
    { condition: 'Type 2 Diabetes', diagnosedDate: '2021-06-20', status: 'Chronic', severity: 'Mild' },
    { condition: 'Arthritis', diagnosedDate: '2019-11-10', status: 'Chronic', severity: 'Mild' }
  ]);

  readonly medications = signal([
    { name: 'Losartan', dosage: '50mg', frequency: 'Once daily', purpose: 'Blood pressure control' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', purpose: 'Blood sugar control' },
    { name: 'Aspirin', dosage: '100mg', frequency: 'Once daily', purpose: 'Cardiovascular protection' }
  ]);

  readonly allergies = signal([
    { allergen: 'Penicillin', type: 'Medication', severity: 'Severe', reaction: 'Anaphylaxis' },
    { allergen: 'Peanuts', type: 'Food', severity: 'Moderate', reaction: 'Hives and swelling' }
  ]);

  readonly emergencyContact = signal({
    name: 'Maria Gonzales',
    relationship: 'Daughter',
    phone: '+51 987 654 321',
    email: 'maria.gonzales@email.com'
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId.set(parseInt(id, 10));
    }
  }

  goBack(): void {
    this.router.navigate(['/health-monitoring/patients']);
  }

  editProfile(): void {
    console.log('Edit profile');
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Healthy': '#4caf50',
      'Critical': '#f44336',
      'Warning': '#ff9800',
      'Stable': '#2196f3',
      'Under Observation': '#ff9800'
    };
    return colors[status] || '#666';
  }

  getSeverityColor(severity: string): string {
    const colors: { [key: string]: string } = {
      'Mild': '#4caf50',
      'Moderate': '#ff9800',
      'Severe': '#f44336'
    };
    return colors[severity] || '#666';
  }
}
