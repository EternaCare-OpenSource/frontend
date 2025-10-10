/**
 * Represents an Appointment entity in the application.
 * @remarks
 * This class is used as a domain model for medical appointments in the appointments context.
 * It encapsulates the properties and behaviors associated with an appointment.
 *
 * @example
 * ```typescript
 * const appointment = new Appointment({
 *   id: 1,
 *   patientId: 1,
 *   doctorId: 1,
 *   appointmentDate: '2025-10-15',
 *   appointmentTime: '10:00',
 *   reason: 'Regular checkup',
 *   status: 'Scheduled',
 *   notes: 'Patient requested morning appointment',
 *   createdAt: '2025-10-01'
 * });
 * ```
 */
export class Appointment {
  /**
   * Unique identifier for the appointment.
   * @defaultValue 0
   */
  private _id: number;

  /**
   * ID of the patient for this appointment.
   * @defaultValue 0
   */
  private _patientId: number;

  /**
   * Name of the patient (for display purposes).
   * @defaultValue null
   */
  private _patientName: string | null;

  /**
   * ID of the doctor for this appointment.
   * @defaultValue 0
   */
  private _doctorId: number;

  /**
   * Name of the doctor (for display purposes).
   * @defaultValue null
   */
  private _doctorName: string | null;

  /**
   * Date of the appointment (YYYY-MM-DD format).
   * @defaultValue ''
   */
  private _appointmentDate: string;

  /**
   * Time of the appointment (HH:MM format).
   * @defaultValue ''
   */
  private _appointmentTime: string;

  /**
   * Reason for the appointment.
   * @defaultValue ''
   */
  private _reason: string;

  /**
   * Status of the appointment (Scheduled, Completed, Cancelled, No-Show).
   * @defaultValue 'Scheduled'
   */
  private _status: string;

  /**
   * Additional notes about the appointment.
   * @defaultValue ''
   */
  private _notes: string;

  /**
   * Creation date of the appointment.
   * @defaultValue ''
   */
  private _createdAt: string;

  /**
   * Creates a new instance of the Appointment class.
   *
   * @param appointment - An object containing properties to initialize the appointment.
   */
  constructor(appointment: {
    id: number;
    patientId: number;
    patientName?: string | null;
    doctorId: number;
    doctorName?: string | null;
    appointmentDate: string;
    appointmentTime: string;
    reason: string;
    status: string;
    notes: string;
    createdAt: string;
  }) {
    this._id = appointment.id;
    this._patientId = appointment.patientId;
    this._patientName = appointment.patientName ?? null;
    this._doctorId = appointment.doctorId;
    this._doctorName = appointment.doctorName ?? null;
    this._appointmentDate = appointment.appointmentDate;
    this._appointmentTime = appointment.appointmentTime;
    this._reason = appointment.reason;
    this._status = appointment.status;
    this._notes = appointment.notes;
    this._createdAt = appointment.createdAt;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get patientId(): number {
    return this._patientId;
  }

  set patientId(value: number) {
    this._patientId = value;
  }

  get patientName(): string | null {
    return this._patientName;
  }

  set patientName(value: string | null) {
    this._patientName = value;
  }

  get doctorId(): number {
    return this._doctorId;
  }

  set doctorId(value: number) {
    this._doctorId = value;
  }

  get doctorName(): string | null {
    return this._doctorName;
  }

  set doctorName(value: string | null) {
    this._doctorName = value;
  }

  get appointmentDate(): string {
    return this._appointmentDate;
  }

  set appointmentDate(value: string) {
    this._appointmentDate = value;
  }

  get appointmentTime(): string {
    return this._appointmentTime;
  }

  set appointmentTime(value: string) {
    this._appointmentTime = value;
  }

  get reason(): string {
    return this._reason;
  }

  set reason(value: string) {
    this._reason = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get notes(): string {
    return this._notes;
  }

  set notes(value: string) {
    this._notes = value;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  set createdAt(value: string) {
    this._createdAt = value;
  }

  /**
   * Gets the full date and time as a formatted string.
   * @returns The formatted datetime string.
   */
  get fullDateTime(): string {
    return `${this._appointmentDate} at ${this._appointmentTime}`;
  }
}
