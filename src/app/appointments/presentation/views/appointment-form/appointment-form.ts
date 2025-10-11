import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppointmentsStore } from '../../../application/appointments.store';
import { HealthMonitoringStore } from '../../../../health-monitoring/application/health-monitoring.store';
import { Appointment } from '../../../domain/model/appointment.entity';

/**
 * Appointment creation and edit form with reactive validation and store integration.
 */
@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './appointment-form.html',
  styleUrls: ['./appointment-form.css']
})
export class AppointmentForm implements OnInit {
  /**
   * Injects Angular services and application stores.
   */
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private appointmentsStore = inject(AppointmentsStore);
  private healthMonitoringStore = inject(HealthMonitoringStore);

  /**
   * Reactive sources for patients and doctors selection.
   */
  readonly patients = this.healthMonitoringStore.patients;
  readonly doctors = this.healthMonitoringStore.doctors;

  /**
   * UI state flags and identifiers.
   */
  readonly loading = signal(false);
  readonly appointmentId = signal<number | null>(null);

  /**
   * Whether the form is in edit mode (id present).
   */
  readonly isEditMode = computed(() => this.appointmentId() !== null);

  /**
   * Main appointment form with validators.
   */
  appointmentForm: FormGroup = this.fb.group({
    patientId: [0, [Validators.required, Validators.min(1)]],
    doctorId: [0, [Validators.required, Validators.min(1)]],
    appointmentDate: ['', [Validators.required]],
    appointmentTime: ['', [Validators.required]],
    reason: ['', [Validators.required]],
    notes: ['']
  });

  /**
   * Optional emergency contact details for the appointment.
   */
  emergencyContactForm: FormGroup = this.fb.group({
    fullName: [''],
    email: ['', [Validators.email]],
    phone: ['']
  });

  /**
   * Supported payment methods displayed in the UI.
   */
  readonly paymentMethods = signal([
    { name: 'Credit Card', icon: 'credit_card', enabled: true },
    { name: 'Yape', icon: 'smartphone', enabled: true },
    { name: 'Plin', icon: 'account_balance_wallet', enabled: true },
    { name: 'PagoEfectivo', icon: 'payments', enabled: true }
  ]);

  /**
   * Initializes edit mode by reading the route param and loading data if needed.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appointmentId.set(parseInt(id, 10));
      this.loadAppointment();
    }
  }

  /**
   * Loads an existing appointment into the form for editing.
   */
  loadAppointment(): void {
    const id = this.appointmentId();
    if (!id) return;

    const appointment = this.appointmentsStore.getAppointmentById(id)();
    if (appointment) {
      this.appointmentForm.patchValue({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        reason: appointment.reason,
        notes: appointment.notes
      });
    }
  }

  /**
   * Submits the form to create or update an appointment with validation feedback.
   */
  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.appointmentForm.value;

    const appointment = new Appointment({
      id: this.appointmentId() || 0,
      patientId: formValue.patientId,
      doctorId: formValue.doctorId,
      appointmentDate: this.formatDate(formValue.appointmentDate),
      appointmentTime: formValue.appointmentTime,
      reason: formValue.reason,
      status: 'Scheduled',
      notes: formValue.notes,
      createdAt: new Date().toISOString()
    });

    if (this.isEditMode()) {
      this.appointmentsStore.updateAppointment(appointment);
      this.snackBar.open('Appointment updated successfully!', 'Close', { duration: 3000 });
    } else {
      this.appointmentsStore.addAppointment(appointment);
      this.snackBar.open('Appointment created successfully!', 'Close', { duration: 3000 });
    }

    this.loading.set(false);
    this.router.navigate(['/appointments/calendar']);
  }

  /**
   * Formats a Date or ISO string into yyyy-mm-dd (ISO date-only).
   * @param date Date object or ISO string.
   * @returns ISO date string (yyyy-mm-dd).
   */
  formatDate(date: Date | string): string {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  }

  /**
   * Cancels the form and returns to the calendar view.
   */
  cancel(): void {
    this.router.navigate(['/appointments/calendar']);
  }

  /**
   * Returns a human-readable validation message for a form control.
   * @param controlName Control name from the appointmentForm.
   * @returns Message for the first detected validation error.
   */
  getErrorMessage(controlName: string): string {
    const control = this.appointmentForm.get(controlName);
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(controlName)} is required`;
    }
    if (control?.hasError('min')) {
      return `Please select a valid ${this.getFieldLabel(controlName).toLowerCase()}`;
    }
    return '';
  }

  /**
   * Maps control names to user-facing labels.
   * @param controlName Control name from the appointmentForm.
   * @returns Label text for the control.
   */
  getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      patientId: 'Patient',
      doctorId: 'Doctor',
      appointmentDate: 'Date',
      appointmentTime: 'Time',
      reason: 'Reason'
    };
    return labels[controlName] || controlName;
  }
}
