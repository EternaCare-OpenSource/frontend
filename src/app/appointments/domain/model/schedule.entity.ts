import {BaseEntity} from '../../../shared/infrastructure/entities/base-entity';


/**
 * Represents a Schedule entity in the application.
 * @remarks
 * This class is used as a domain model for doctor schedules in the appointments context.
 * It implements the BaseEntity interface to ensure consistency across entities.
 * @see {@link BaseEntity}
 */
export class Schedule implements BaseEntity {
  /**
   * Creates a new Schedule instance.
   * @param schedule - An object containing the schedule's information.
   * @returns A new instance of Schedule.
   */
  constructor(schedule: {
    id: number;
    doctorId: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }) {
    this._id = schedule.id;
    this._doctorId = schedule.doctorId;
    this._dayOfWeek = schedule.dayOfWeek;
    this._startTime = schedule.startTime;
    this._endTime = schedule.endTime;
    this._isAvailable = schedule.isAvailable;
  }

  /**
   * The unique identifier for the schedule.
   */
  private _id: number;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  /**
   * The ID of the doctor this schedule belongs to.
   */
  private _doctorId: number;

  get doctorId(): number {
    return this._doctorId;
  }

  set doctorId(value: number) {
    this._doctorId = value;
  }

  /**
   * The day of the week (Monday, Tuesday, etc.).
   */
  private _dayOfWeek: string;

  get dayOfWeek(): string {
    return this._dayOfWeek;
  }

  set dayOfWeek(value: string) {
    this._dayOfWeek = value;
  }

  /**
   * The start time of availability.
   */
  private _startTime: string;

  get startTime(): string {
    return this._startTime;
  }

  set startTime(value: string) {
    this._startTime = value;
  }

  /**
   * The end time of availability.
   */
  private _endTime: string;

  get endTime(): string {
    return this._endTime;
  }

  set endTime(value: string) {
    this._endTime = value;
  }

  /**
   * Indicates if the time slot is available.
   */
  private _isAvailable: boolean;

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  set isAvailable(value: boolean) {
    this._isAvailable = value;
  }
}
