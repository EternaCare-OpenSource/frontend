import {Doctor} from './doctor.entity';

/**
 * Represents a Patient entity in the application.
 * @remarks
 * This class is used as a domain model for patients in the health monitoring context.
 * It encapsulates the properties and behaviors associated with a patient, including their doctor assignment.
 *
 * @example
 * ```typescript
 * const patient = new Patient({
 *   id: 1,
 *   firstName: 'Juan',
 *   lastName: 'Gonzales',
 *   email: 'juan@example.com',
 *   age: 77,
 *   sex: 'Male',
 *   bloodType: 'A+',
 *   patientId: '#829130224',
 *   healthInsurance: 'EsSalud',
 *   preferredHospital: 'Hospital Almenara',
 *   status: 'Healthy',
 *   assignedDoctorId: 1,
 *   registerDate: '2025-09-20'
 * });
 * console.log(patient.fullName); // Output: Juan Gonzales
 * ```
 */
export class Patient {
  /**
   * The doctor assigned to the patient.
   * @remarks
   * This is an object reference to the {@link Doctor} entity. It may be null if not set.
   */
  get doctor(): Doctor | null {
    return this._doctor;
  }

  /**
   * Sets the doctor assigned to the patient.
   *
   * @param value - The {@link Doctor} to assign to the patient.
   */
  set doctor(value: Doctor | null) {
    this._doctor = value;
  }

  /**
   * Unique identifier for the patient.
   * @defaultValue 0
   */
  private _id: number;

  /**
   * First name of the patient.
   * @defaultValue ''
   */
  private _firstName: string;

  /**
   * Last name of the patient.
   * @defaultValue ''
   */
  private _lastName: string;

  /**
   * Email of the patient.
   * @defaultValue ''
   */
  private _email: string;

  /**
   * Age of the patient.
   * @defaultValue 0
   */
  private _age: number;

  /**
   * Sex of the patient (Male/Female).
   * @defaultValue ''
   */
  private _sex: string;

  /**
   * Blood type of the patient (A+, B+, O+, etc.).
   * @defaultValue ''
   */
  private _bloodType: string;

  /**
   * Unique patient ID (e.g., #829130224).
   * @defaultValue ''
   */
  private _patientId: string;

  /**
   * Health insurance provider of the patient.
   * @defaultValue ''
   */
  private _healthInsurance: string;

  /**
   * Preferred hospital of the patient.
   * @defaultValue ''
   */
  private _preferredHospital: string;

  /**
   * Current health status of the patient (Healthy, Critical, etc.).
   * @defaultValue ''
   */
  private _status: string;

  /**
   * Identifier of the assigned doctor.
   * @defaultValue 0
   */
  private _assignedDoctorId: number;

  /**
   * Registration date of the patient.
   * @defaultValue ''
   */
  private _registerDate: string;

  /**
   * The doctor object assigned to the patient, or null if not set.
   * @defaultValue null
   */
  private _doctor: Doctor | null;

  /**
   * Creates a new instance of the Patient class.
   *
   * @param patient - An object containing properties to initialize the patient.
   */
  constructor(patient: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    sex: string;
    bloodType: string;
    patientId: string;
    healthInsurance: string;
    preferredHospital: string;
    status: string;
    assignedDoctorId: number;
    registerDate: string;
    doctor?: Doctor | null;
  }) {
    this._id = patient.id;
    this._firstName = patient.firstName;
    this._lastName = patient.lastName;
    this._email = patient.email;
    this._age = patient.age;
    this._sex = patient.sex;
    this._bloodType = patient.bloodType;
    this._patientId = patient.patientId;
    this._healthInsurance = patient.healthInsurance;
    this._preferredHospital = patient.preferredHospital;
    this._status = patient.status;
    this._assignedDoctorId = patient.assignedDoctorId;
    this._registerDate = patient.registerDate;
    this._doctor = patient.doctor ?? null;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    this._age = value;
  }

  get sex(): string {
    return this._sex;
  }

  set sex(value: string) {
    this._sex = value;
  }

  get bloodType(): string {
    return this._bloodType;
  }

  set bloodType(value: string) {
    this._bloodType = value;
  }

  get patientId(): string {
    return this._patientId;
  }

  set patientId(value: string) {
    this._patientId = value;
  }

  get healthInsurance(): string {
    return this._healthInsurance;
  }

  set healthInsurance(value: string) {
    this._healthInsurance = value;
  }

  get preferredHospital(): string {
    return this._preferredHospital;
  }

  set preferredHospital(value: string) {
    this._preferredHospital = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get assignedDoctorId(): number {
    return this._assignedDoctorId;
  }

  set assignedDoctorId(value: number) {
    this._assignedDoctorId = value;
  }

  get registerDate(): string {
    return this._registerDate;
  }

  set registerDate(value: string) {
    this._registerDate = value;
  }

  /**
   * Gets the full name of the patient.
   * @returns The full name (firstName + lastName).
   */
  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }
}
