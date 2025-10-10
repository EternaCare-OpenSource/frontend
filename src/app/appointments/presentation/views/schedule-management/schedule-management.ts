import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppointmentsStore } from '../../../application/appointments.store';
import { HealthMonitoringStore } from '../../../../health-monitoring/application/health-monitoring.store';
import { Schedule } from '../../../domain/model/schedule.entity';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-schedule-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatChipsModule,
    MatSnackBarModule,
    MatMenu,
    MatMenuTrigger,
    MatDivider,
    MatMenuItem
  ],
  templateUrl: './schedule-management.html',
  styleUrl: './schedule-management.css'
})
export class ScheduleManagement {
  private fb = inject(FormBuilder);
  private appointmentsStore = inject(AppointmentsStore);
  private healthMonitoringStore = inject(HealthMonitoringStore);
  private snackBar = inject(MatSnackBar);

  readonly doctors = this.healthMonitoringStore.doctors;
  readonly schedules = this.appointmentsStore.schedules;
  readonly loading = signal(false);
  readonly isEditing = signal(false);
  readonly editingScheduleId = signal<number | null>(null);

  readonly daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  scheduleForm: FormGroup = this.fb.group({
    doctorId: [0, [Validators.required, Validators.min(1)]],
    dayOfWeek: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: ['', [Validators.required]],
    isAvailable: [true]
  });

  readonly displayedColumns: string[] = ['doctor', 'day', 'timeRange', 'status', 'actions'];

  readonly selectedDoctorId = signal<number>(0);

  readonly filteredSchedules = computed(() => {
    const doctorId = this.selectedDoctorId();
    if (!doctorId) return this.schedules();
    return this.schedules().filter(s => s.doctorId === doctorId);
  });

  onSubmit(): void {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.scheduleForm.value;

    const schedule = new Schedule({
      id: this.editingScheduleId() || 0,
      doctorId: formValue.doctorId,
      dayOfWeek: formValue.dayOfWeek,
      startTime: formValue.startTime,
      endTime: formValue.endTime,
      isAvailable: formValue.isAvailable
    });

    if (this.isEditing()) {
      this.appointmentsStore.updateSchedule(schedule);
      this.snackBar.open('Schedule updated successfully!', 'Close', { duration: 3000 });
    } else {
      this.appointmentsStore.addSchedule(schedule);
      this.snackBar.open('Schedule created successfully!', 'Close', { duration: 3000 });
    }

    this.loading.set(false);
    this.resetForm();
  }

  editSchedule(schedule: Schedule): void {
    this.isEditing.set(true);
    this.editingScheduleId.set(schedule.id);
    this.scheduleForm.patchValue({
      doctorId: schedule.doctorId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isAvailable: schedule.isAvailable
    });
  }

  deleteSchedule(schedule: Schedule): void {
    if (confirm(`Delete schedule for ${schedule.dayOfWeek}?`)) {
      this.appointmentsStore.deleteSchedule(schedule.id);
      this.snackBar.open('Schedule deleted successfully!', 'Close', { duration: 3000 });
    }
  }

  resetForm(): void {
    this.scheduleForm.reset({ isAvailable: true, doctorId: 0 });
    this.isEditing.set(false);
    this.editingScheduleId.set(null);
  }

  getDoctorName(doctorId: number): string {
    const doctor = this.healthMonitoringStore.getDoctorById(doctorId)();
    return doctor ? `Dr. ${doctor.fullName}` : 'Unknown';
  }

  getErrorMessage(controlName: string): string {
    const control = this.scheduleForm.get(controlName);
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
      doctorId: 'Doctor',
      dayOfWeek: 'Day',
      startTime: 'Start time',
      endTime: 'End time'
    };
    return labels[controlName] || controlName;
  }

  hasSchedulesForDay(day: string): boolean {
    return this.schedules().filter(s => s.dayOfWeek === day && s.isAvailable).length === 0;
  }

  getSchedulesForDay(day: string): Schedule[] {
    return this.schedules().filter(s => s.dayOfWeek === day && s.isAvailable);
  }
}
