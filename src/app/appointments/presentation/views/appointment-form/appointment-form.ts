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
import {AppointmentsStore} from '../../../application/appointments.store';
import {HealthMonitoringStore} from '../../../../health-monitoring/application/health-monitoring.store';
import {Appointment} from '../../../domain/model/appointment.entity';


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
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private appointmentsStore = inject(AppointmentsStore);
  private healthMonitoringStore = inject(HealthMonitoringStore);

  readonly patients = this.healthMonitoringStore.patients;
  readonly doctors = this.healthMonitoringStore.doctors;
  readonly loading = signal(false);
  readonly appointmentId = signal<number | null>(null);
  readonly isEditMode = computed(() => this.appointmentId() !== null);

  appointmentForm: FormGroup = this.fb.group({
    patientId: [0, [Validators.required, Validators.min(1)]],
    doctorId: [0, [Validators.required, Validators.min(1)]],
    appointmentDate: ['', [Validators.required]],
    appointmentTime: ['', [Validators.required]],
    reason: ['', [Validators.required]],
    notes: ['']
  });

  emergencyContactForm: FormGroup = this.fb.group({
    fullName: [''],
    email: ['', [Validators.email]],
    phone: ['']
  });

  readonly paymentMethods = signal([
    { name: 'Credit Card', icon: 'credit_card', enabled: true },
    { name: 'Yape', icon: 'smartphone', enabled: true },
    { name: 'Plin', icon: 'account_balance_wallet', enabled: true },
    { name: 'PagoEfectivo', icon: 'payments', enabled: true }
  ]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appointmentId.set(parseInt(id, 10));
      this.loadAppointment();
    }
  }

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

  formatDate(date: Date | string): string {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  }

  cancel(): void {
    this.router.navigate(['/appointments/calendar']);
  }

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
