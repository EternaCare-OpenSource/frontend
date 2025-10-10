import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import {HealthMonitoringStore} from '../../../application/health-monitoring.store';


interface VitalSign {
  label: string;
  value: string;
  unit: string;
  icon: string;
  status: 'normal' | 'warning' | 'critical';
}

interface Medication {
  name: string;
  date: string;
  taken: boolean;
}

interface Activity {
  title: string;
  subtitle: string;
  icon: string;
}

@Component({
  selector: 'app-diagnosis',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './diagnosis.html',
  styleUrls: ['./diagnosis.css']
})
export class Diagnosis implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private healthMonitoringStore = inject(HealthMonitoringStore);

  readonly patientId = signal<number>(0);

  readonly patient = computed(() => {
    const id = this.patientId();
    return this.healthMonitoringStore.getPatientById(id)();
  });

  readonly vitalSigns = signal<VitalSign[]>([
    { label: 'Heart Rate', value: '000', unit: 'BPM', icon: 'favorite', status: 'normal' },
    { label: 'Blood Pressure', value: '000/000', unit: '', icon: 'bloodtype', status: 'normal' },
    { label: 'Glucose', value: '000/000', unit: '', icon: 'water_drop', status: 'normal' },
    { label: 'Water', value: '0.0', unit: 'Liters', icon: 'local_drink', status: 'normal' }
  ]);

  readonly medications = signal<Medication[]>([
    { name: 'Medication', date: '10 Dec, 2020', taken: true },
    { name: 'Medication', date: '10 Dec, 2020', taken: false },
    { name: 'Medication', date: '10 Dec, 2020', taken: true }
  ]);

  readonly activities = signal<Activity[]>([
    { title: 'Doctor Watson', subtitle: 'Charge', icon: 'person' },
    { title: 'Hospital', subtitle: 'Details', icon: 'local_hospital' }
  ]);

  readonly recommendations = signal(
    'The patient takes one tablet with a glass of water every morning before breakfast to help manage their condition.'
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId.set(parseInt(id, 10));
    }
  }

  goBack(): void {
    this.router.navigate(['/health-monitoring/dashboard']);
  }

  getStatusColor(status: string): string {
    const colors = {
      'normal': '#4caf50',
      'warning': '#ff9800',
      'critical': '#f44336'
    };
    return colors[status as keyof typeof colors] || '#666';
  }
}
