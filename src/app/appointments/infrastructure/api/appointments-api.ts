import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {BaseApi} from '../../../shared/infrastructure/api/base-api';
import {AppointmentsApiEndpoint} from '../endpoints/appointments-api-endpoint';
import {SchedulesApiEndpoint} from '../endpoints/schedules-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Appointment} from '../../domain/model/appointment.entity';
import {Schedule} from '../../domain/model/schedule.entity';

/**
 * API service for managing endpoints in the appointments context.
 */
@Injectable({providedIn: 'root'})
export class AppointmentsApi extends BaseApi {
  private readonly appointmentsEndpoint: AppointmentsApiEndpoint;
  private readonly schedulesEndpoint: SchedulesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.appointmentsEndpoint = new AppointmentsApiEndpoint(http);
    this.schedulesEndpoint = new SchedulesApiEndpoint(http);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsEndpoint.getAll();
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.appointmentsEndpoint.getById(id);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.appointmentsEndpoint.create(appointment);
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.appointmentsEndpoint.update(appointment, appointment.id);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.appointmentsEndpoint.delete(id);
  }

  getSchedules(): Observable<Schedule[]> {
    return this.schedulesEndpoint.getAll();
  }

  getSchedule(id: number): Observable<Schedule> {
    return this.schedulesEndpoint.getById(id);
  }

  createSchedule(schedule: Schedule): Observable<Schedule> {
    return this.schedulesEndpoint.create(schedule);
  }

  updateSchedule(schedule: Schedule): Observable<Schedule> {
    return this.schedulesEndpoint.update(schedule, schedule.id);
  }

  deleteSchedule(id: number): Observable<void> {
    return this.schedulesEndpoint.delete(id);
  }
}
