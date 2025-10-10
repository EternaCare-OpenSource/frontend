import {computed, Injectable, Signal, signal} from '@angular/core';
import {Appointment} from '../domain/model/appointment.entity';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {Schedule} from '../domain/model/schedule.entity';
import {AppointmentsApi} from '../infrastructure/api/appointments-api';

/**
 * State management store for appointments and schedules using Angular signals.
 */
@Injectable({
  providedIn: 'root'
})
export class AppointmentsStore {
  readonly appointmentCount = computed(() => this.appointments().length);
  readonly scheduleCount = computed(() => this.schedules().length);

  private readonly appointmentsSignal = signal<Appointment[]>([]);
  readonly appointments = this.appointmentsSignal.asReadonly();

  private readonly schedulesSignal = signal<Schedule[]>([]);
  readonly schedules = this.schedulesSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private appointmentsApi: AppointmentsApi) {
    this.loadSchedules();
    this.loadAppointments();
  }

  getScheduleById(id: number): Signal<Schedule | undefined> {
    return computed(() => id ? this.schedules().find(s => s.id === id) : undefined);
  }

  getAppointmentById(id: number): Signal<Appointment | undefined> {
    return computed(() => id ? this.appointments().find(a => a.id === id) : undefined);
  }

  addAppointment(appointment: Appointment): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.createAppointment(appointment).pipe(retry(2)).subscribe({
      next: createdAppointment => {
        this.appointmentsSignal.update(appointments => [...appointments, createdAppointment]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create appointment'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateAppointment(updatedAppointment: Appointment): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.updateAppointment(updatedAppointment).pipe(retry(2)).subscribe({
      next: appointment => {
        this.appointmentsSignal.update(appointments =>
          appointments.map(a => a.id === appointment.id ? appointment : a)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update appointment'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteAppointment(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.deleteAppointment(id).pipe(retry(2)).subscribe({
      next: () => {
        this.appointmentsSignal.update(appointments => appointments.filter(a => a.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete appointment'));
        this.loadingSignal.set(false);
      }
    });
  }

  addSchedule(schedule: Schedule): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.createSchedule(schedule).pipe(retry(2)).subscribe({
      next: createdSchedule => {
        this.schedulesSignal.update(schedules => [...schedules, createdSchedule]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create schedule'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateSchedule(updatedSchedule: Schedule): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.updateSchedule(updatedSchedule).pipe(retry(2)).subscribe({
      next: schedule => {
        this.schedulesSignal.update(schedules =>
          schedules.map(s => s.id === schedule.id ? schedule : s)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update schedule'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteSchedule(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.deleteSchedule(id).pipe(retry(2)).subscribe({
      next: () => {
        this.schedulesSignal.update(schedules => schedules.filter(s => s.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete schedule'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadAppointments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.getAppointments().pipe(takeUntilDestroyed()).subscribe({
      next: appointments => {
        this.appointmentsSignal.set(appointments);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load appointments'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadSchedules(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.appointmentsApi.getSchedules().pipe(takeUntilDestroyed()).subscribe({
      next: schedules => {
        this.schedulesSignal.set(schedules);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load schedules'));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
