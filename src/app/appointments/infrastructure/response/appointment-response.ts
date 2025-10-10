import {BaseResource, BaseResponse} from '../../../shared/infrastructure/response/base-response';


/**
 * Represents a single appointment resource returned from the API.
 */
export interface AppointmentResource extends BaseResource {
  id: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
  notes: string;
  createdAt: string;
}

/**
 * Represents the response structure for a list of appointments from the API.
 */
export interface AppointmentsResponse extends BaseResponse {
  appointments: AppointmentResource[];
}
