import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { HealthMonitoringStore } from '../../../application/health-monitoring.store';

/**
 *
 * Represents a vital sign item rendered on the diagnosis view.
 * Includes display label, value with unit, icon and status severity.
 */
interface VitalSign {
  label: string;
  value: string;
  unit: string;
  icon: string;
  status: 'normal' | 'warning' | 'critical';
}

/**
 *
 * Medication record shown in the diagnosis timeline with taken status.
 */
interface Medication {
  name: string;
  date: string;
  taken: boolean;
}

/**
 *
 * Generic activity item displayed in the patient's recent activity list.
 */
interface Activity {
  title: string;
  subtitle: string;
  icon: string;
}

/**
 *
 * Patient diagnosis page showing vitals, meds, activities, and recommendations.
 * Uses Angular Signals for reactive state and reads patient by route param.
 */
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
  /**
   *
   * Router and store dependencies.
   */
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private healthMonitoringStore = inject(HealthMonitoringStore);

  /**
   *
   * Current patient id taken from route params.
   */
  readonly patientId = signal<number>(0);

  /**
   *
   * Reactive selector that resolves the current patient from the store.
   */
  readonly patient = computed(() => {
    const id = this.patientId();
    return this.healthMonitoringStore.getPatientById(id)();
  });

  /**
   *
   * Vital signs displayed in the header cards of the diagnosis view.
   */
  readonly vitalSigns = signal<VitalSign[]>([
    { label: 'Heart Rate',     value: '000',      unit: 'BPM',     icon: 'favorite',   status: 'normal' },
    { label: 'Blood Pressure', value: '000/000',  unit: '',        icon: 'bloodtype',  status: 'normal' },
    { label: 'Glucose',        value: '000/000',  unit: '',        icon: 'water_drop', status: 'normal' },
    { label: 'Water',          value: '0.0',      unit: 'Liters',  icon: 'local_drink',status: 'normal' }
  ]);

  /**
   *
   * Recent medications list with taken status for quick review.
   */
  readonly medications = signal<Medication[]>([
    { name: 'Medication', date: '10 Dec, 2020', taken: true  },
    { name: 'Medication', date: '10 Dec, 2020', taken: false },
    { name: 'Medication', date: '10 Dec, 2020', taken: true  }
  ]);

  /**
   *
   * Recent activities related to the patient (doctor/hospital interactions).
   */
  readonly activities = signal<Activity[]>([
    { title: 'Doctor Watson', subtitle: 'Charge',  icon: 'person' },
    { title: 'Hospital',      subtitle: 'Details', icon: 'local_hospital' }
  ]);

  /**
   *
   * Physician recommendations or care instructions for the patient.
   */
  readonly recommendations = signal(
    'The patient takes one tablet with a glass of water every morning before breakfast to help manage their condition.'
  );

  /**
   *
   * Initializes the component by reading the :id route parameter.
   * When present, it sets the current patient id signal.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId.set(parseInt(id, 10));
    }
  }

  /**
   *
   * Navigates back to the health monitoring dashboard.
   */
  goBack(): void {
    this.router.navigate(['/health-monitoring/dashboard']);
  }

  /**
   *
   * Maps a semantic status to a hex color used in UI indicators.
   * @param status The status severity ('normal' | 'warning' | 'critical').
   * @returns A hex color string to style status chips and icons.
   */
  getStatusColor(status: string): string {
    const colors = {
      'normal':  '#4caf50',
      'warning': '#ff9800',
      'critical':'#f44336'
    };
    return colors[status as keyof typeof colors] || '#666';
  }
}
