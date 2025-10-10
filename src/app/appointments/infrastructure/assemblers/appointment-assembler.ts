import {BaseAssembler} from '../../../shared/infrastructure/assemblers/base-assembler';
import {Appointment} from '../../domain/model/appointment.entity';
import {AppointmentResource, AppointmentsResponse} from '../response/appointment-response';


/**
 * Assembler for converting between Appointment entities, AppointmentResource resources, and AppointmentsResponse.
 */
export class AppointmentAssembler implements BaseAssembler<Appointment, AppointmentResource, AppointmentsResponse> {

  toEntitiesFromResponse(response: AppointmentsResponse): Appointment[] {
    console.log(response);
    return response.appointments.map(resource => this.toEntityFromResource(resource as AppointmentResource));
  }

  toEntityFromResource(resource: AppointmentResource): Appointment {
    return new Appointment({
      id: resource.id,
      patientId: resource.patientId,
      patientName: resource.patientName,
      doctorId: resource.doctorId,
      doctorName: resource.doctorName,
      appointmentDate: resource.appointmentDate,
      appointmentTime: resource.appointmentTime,
      reason: resource.reason,
      status: resource.status,
      notes: resource.notes,
      createdAt: resource.createdAt
    });
  }

  toResourceFromEntity(entity: Appointment): AppointmentResource {
    return {
      id: entity.id,
      patientId: entity.patientId,
      patientName: entity.patientName ?? undefined,
      doctorId: entity.doctorId,
      doctorName: entity.doctorName ?? undefined,
      appointmentDate: entity.appointmentDate,
      appointmentTime: entity.appointmentTime,
      reason: entity.reason,
      status: entity.status,
      notes: entity.notes,
      createdAt: entity.createdAt
    } as AppointmentResource;
  }
}
