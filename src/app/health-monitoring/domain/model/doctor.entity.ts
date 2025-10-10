import {BaseEntity} from '../../../shared/infrastructure/entities/base-entity';


/**
 * Represents a Doctor entity in the application.
 * @remarks
 * This class is used as a domain model for doctors in the health monitoring context.
 * It implements the BaseEntity interface to ensure consistency across entities.
 * @see {@link BaseEntity}
 */
export class Doctor implements BaseEntity {
  /**
   * Creates a new Doctor instance.
   * @param doctor - An object containing the doctor's information.
   * @returns A new instance of Doctor.
   */
  constructor(doctor: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    specialization: string;
    cmpCode: string;
    studyCentre: string;
    phoneNumber: string;
  }) {
    this._id = doctor.id;
    this._firstName = doctor.firstName;
    this._lastName = doctor.lastName;
    this._email = doctor.email;
    this._specialization = doctor.specialization;
    this._cmpCode = doctor.cmpCode;
    this._studyCentre = doctor.studyCentre;
    this._phoneNumber = doctor.phoneNumber;
  }

  /**
   * The unique identifier for the doctor.
   */
  private _id: number;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  /**
   * The first name of the doctor.
   */
  private _firstName: string;

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  /**
   * The last name of the doctor.
   */
  private _lastName: string;

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  /**
   * The email of the doctor.
   */
  private _email: string;

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  /**
   * The medical specialization of the doctor.
   */
  private _specialization: string;

  get specialization(): string {
    return this._specialization;
  }

  set specialization(value: string) {
    this._specialization = value;
  }

  /**
   * The CMP (Colegio Médico del Perú) code of the doctor.
   */
  private _cmpCode: string;

  get cmpCode(): string {
    return this._cmpCode;
  }

  set cmpCode(value: string) {
    this._cmpCode = value;
  }

  /**
   * The study centre where the doctor studied.
   */
  private _studyCentre: string;

  get studyCentre(): string {
    return this._studyCentre;
  }

  set studyCentre(value: string) {
    this._studyCentre = value;
  }

  /**
   * The phone number of the doctor.
   */
  private _phoneNumber: string;

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  /**
   * Gets the full name of the doctor.
   * @returns The full name (firstName + lastName).
   */
  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }
}
