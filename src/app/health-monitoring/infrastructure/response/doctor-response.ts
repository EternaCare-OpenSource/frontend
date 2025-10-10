import {BaseResource, BaseResponse} from '../../../shared/infrastructure/response/base-response';


/**
 * Represents the API resource/DTO for a doctor.
 */
export interface DoctorResource extends BaseResource {
  /**
   * The unique identifier for the doctor.
   */
  id: number;

  /**
   * The first name of the doctor.
   */
  firstName: string;

  /**
   * The last name of the doctor.
   */
  lastName: string;

  /**
   * The email of the doctor.
   */
  email: string;

  /**
   * The medical specialization of the doctor.
   */
  specialization: string;

  /**
   * The CMP (Colegio Médico del Perú) code of the doctor.
   */
  cmpCode: string;

  /**
   * The study centre where the doctor studied.
   */
  studyCentre: string;

  /**
   * The phone number of the doctor.
   */
  phoneNumber: string;
}

/**
 * Represents the API response structure for a list of doctors.
 */
export interface DoctorsResponse extends BaseResponse {
  /**
   * The list of doctors returned by the API.
   */
  doctors: DoctorResource[];
}
