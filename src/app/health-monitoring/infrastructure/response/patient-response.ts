import {BaseResource, BaseResponse} from '../../../shared/infrastructure/response/base-response';


/**
 * Represents a single patient resource returned from the API.
 *
 * @remarks
 * This interface extends {@link BaseResource} and includes the core properties of a patient.
 */
export interface PatientResource extends BaseResource {
  /**
   * Unique identifier for the patient.
   */
  id: number;

  /**
   * First name of the patient.
   */
  firstName: string;

  /**
   * Last name of the patient.
   */
  lastName: string;

  /**
   * Email of the patient.
   */
  email: string;

  /**
   * Age of the patient.
   */
  age: number;

  /**
   * Sex of the patient (Male/Female).
   */
  sex: string;

  /**
   * Blood type of the patient (A+, B+, O+, etc.).
   */
  bloodType: string;

  /**
   * Unique patient ID (e.g., #829130224).
   */
  patientId: string;

  /**
   * Health insurance provider of the patient.
   */
  healthInsurance: string;

  /**
   * Preferred hospital of the patient.
   */
  preferredHospital: string;

  /**
   * Current health status of the patient (Healthy, Critical, etc.).
   */
  status: string;

  /**
   * Identifier of the assigned doctor.
   */
  assignedDoctorId: number;

  /**
   * Registration date of the patient.
   */
  registerDate: string;
}

/**
 * Represents the response structure for a list of patients from the API.
 *
 * @remarks
 * This interface extends {@link BaseResponse} and contains an array of {@link PatientResource} objects.
 *
 * @example
 * ```typescript
 * const response: PatientsResponse = {
 *   status: 'success',
 *   patients: [
 *     { id: 1, firstName: 'Juan', lastName: 'Gonzales', ... },
 *     { id: 2, firstName: 'Maria', lastName: 'Lopez', ... }
 *   ]
 * };
 * ```
 */
export interface PatientsResponse extends BaseResponse {
  /**
   * Array of patient resources included in the response.
   */
  patients: PatientResource[];
}
