import {computed, Injectable, Signal, signal} from '@angular/core';
import {Appointment} from '../domain/model/appointment.entity';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {Schedule} from '../domain/model/schedule.entity';
import {AppointmentsApi} from '../infrastructure/api/appointments-api';

/**
 * State management store for appointments and schedules using Angular Signals.
 * Exposes readonly Signals for UI consumption and wraps API calls with optimistic updates.
 */
@Injectable({
  providedIn: 'root'
})
export class AppointmentsStore {
  /**
   * Computed count of appointments.
   */
  readonly appointmentCount = computed(() => this.appointments().length);

  /**
   * Computed count of schedules.
   */
  readonly scheduleCount = computed(() => this.schedules().length);

  /**
   * Internal mutable signal holding the list of appointments.
   */
  private readonly appointmentsSignal = signal<Appointment[]>([]);

  /**
   * Public readonly view of appointments.
   */
  readonly appointments = this.appointmentsSignal.asReadonly();

  /**
   * Internal mutable signal holding the list of schedules.
   */
  private readonly schedulesSignal = signal<Schedule[]>([]);

  /**
   * Public readonly view of schedules.
   */
  readonly schedules = this.schedulesSignal.asReadonly();

  /**
   * Global loading state for store operations.
   */
  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Public readonly loading state for UI binding.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Internal error message signal.
   */
  private readonly errorSignal = signal<string | null>(null);

  /**
   * Public readonly error signal for UI feedback.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Initializes the store and triggers initial loads for schedules and appointments.
   * @param appointmentsApi API service for CRUD operations.
   */
  constructor(private appointmentsApi: AppointmentsApi) {
    this.loadSchedules();
    this.loadAppointments();
  }

  /**
   * Returns a reactive view of a schedule by id.
   * @param id Schedule identifier.
   * @returns Signal with the found Schedule or undefined.
   */
  getScheduleById(id: number): Signal<Schedule | undefined> {
    return computed(() => id ? this.schedules().find(s => s.id === id) : undefined);
  }

  /**
   * Returns a reactive view of an appointment by id.
   * @param id Appointment identifier.
   * @returns Signal with the found Appointment or undefined.
   */
  getAppointmentById(id: number): Signal<Appointment | undefined> {
    return computed(() => id ? this.appointments().find(a => a.id === id) : undefined);
  }

  /**
   * Creates a new appointment via API and updates state.
   * @param appointment Appointment payload to create.
   */
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

  /**
   * Updates an existing appointment via API and reconciles local state.
   * @param updatedAppointment Appointment payload with updated fields.
   */
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

  /**
   * Deletes an appointment via API and removes it from local state.
   * @param id Appointment identifier to delete.
   */
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

  /**
   * Creates a new schedule via API and updates state.
   * @param schedule Schedule payload to create.
   */
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

  /**
   * Updates an existing schedule via API and reconciles local state.
   * @param updatedSchedule Schedule payload with updated fields.
   */
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

  /**
   * Deletes a schedule via API and removes it from local state.
   * @param id Schedule identifier to delete.
   */
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

  /**
   * Loads all appointments from the API and hydrates state.
   * Uses takeUntilDestroyed() to auto-unsubscribe with the injector context.
   */
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

  /**
   * Loads all schedules from the API and hydrates state.
   * Uses takeUntilDestroyed() to auto-unsubscribe with the injector context.
   */
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

  /**
   * Normalizes an unknown error into a user-friendly message.
   * @param error Raw error object from HttpClient or thrown error.
   * @param fallback Default message when error is not parseable.
   * @returns Formatted string suitable for UI display.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
