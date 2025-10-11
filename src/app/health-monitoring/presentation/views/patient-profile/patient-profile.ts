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

/**
 *
 * Patient profile view showing patient demographics, assigned doctor,
 * medical history, medications, allergies, and emergency contact.
 * Uses Angular Signals and computed selectors for reactive state.
 */
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
  /**
   *
   * Router and store dependencies.
   */
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private healthMonitoringStore = inject(HealthMonitoringStore);

  /**
   *
   * Current patient id resolved from the route parameter.
   */
  readonly patientId = signal<number>(0);

  /**
   *
   * Reactive selector that fetches the current patient entity from the store.
   */
  readonly patient = computed(() => {
    const id = this.patientId();
    return this.healthMonitoringStore.getPatientById(id)();
  });

  /**
   *
   * Primary doctor assigned to the current patient, or null if none.
   */
  readonly assignedDoctor = computed(() => {
    return this.patient()?.doctor || null;
  });

  /**
   *
   * Medical history entries (diagnosed conditions with status and severity).
   */
  readonly medicalHistory = signal([
    { condition: 'Hypertension',     diagnosedDate: '2020-03-15', status: 'Chronic', severity: 'Moderate' },
    { condition: 'Type 2 Diabetes',  diagnosedDate: '2021-06-20', status: 'Chronic', severity: 'Mild'     },
    { condition: 'Arthritis',        diagnosedDate: '2019-11-10', status: 'Chronic', severity: 'Mild'     }
  ]);

  /**
   *
   * Active medications with dosage, frequency, and purpose.
   */
  readonly medications = signal([
    { name: 'Losartan',  dosage: '50mg',  frequency: 'Once daily',  purpose: 'Blood pressure control'   },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', purpose: 'Blood sugar control'      },
    { name: 'Aspirin',   dosage: '100mg', frequency: 'Once daily',  purpose: 'Cardiovascular protection'}
  ]);

  /**
   *
   * Known allergy list with type, severity, and reaction details.
   */
  readonly allergies = signal([
    { allergen: 'Penicillin', type: 'Medication', severity: 'Severe',   reaction: 'Anaphylaxis'          },
    { allergen: 'Peanuts',    type: 'Food',       severity: 'Moderate', reaction: 'Hives and swelling'   }
  ]);

  /**
   *
   * Emergency contact information for the patient.
   */
  readonly emergencyContact = signal({
    name: 'Maria Gonzales',
    relationship: 'Daughter',
    phone: '+51 987 654 321',
    email: 'maria.gonzales@email.com'
  });

  /**
   *
   * Initializes the component by reading the `:id` parameter from the route.
   * Sets the `patientId` signal when present.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId.set(parseInt(id, 10));
    }
  }

  /**
   *
   * Navigates back to the patients list page.
   */
  goBack(): void {
    this.router.navigate(['/health-monitoring/patients']);
  }

  /**
   *
   * Opens the edit flow for the current patient profile (placeholder).
   */
  editProfile(): void {
    console.log('Edit profile');
  }

  /**
   *
   * Maps a patient health status to a hex color used by UI chips/badges.
   * @param status Health status label.
   * @returns Hex color string.
   */
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Healthy':            '#4caf50',
      'Critical':           '#f44336',
      'Warning':            '#ff9800',
      'Stable':             '#2196f3',
      'Under Observation':  '#ff9800'
    };
    return colors[status] || '#666';
  }

  /**
   *
   * Maps a severity label to a hex color for consistent UI highlighting.
   * @param severity Severity label ('Mild' | 'Moderate' | 'Severe').
   * @returns Hex color string.
   */
  getSeverityColor(severity: string): string {
    const colors: { [key: string]: string } = {
      'Mild':     '#4caf50',
      'Moderate': '#ff9800',
      'Severe':   '#f44336'
    };
    return colors[severity] || '#666';
  }
}
