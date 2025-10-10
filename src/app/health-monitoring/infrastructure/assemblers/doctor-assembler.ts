
import {Doctor} from '../../domain/model/doctor.entity';
import {DoctorResource, DoctorsResponse} from '../response/doctor-response';
import {BaseAssembler} from '../../../shared/infrastructure/assemblers/base-assembler';


/**
 * Assembler for converting between Doctor entities, DoctorResource resources, and DoctorsResponse.
 */
export class DoctorAssembler implements BaseAssembler<Doctor, DoctorResource, DoctorsResponse> {

  /**
   * Converts a DoctorsResponse to an array of Doctor entities.
   * @param response - The API response containing doctors.
   * @returns An array of Doctor entities.
   */
  toEntitiesFromResponse(response: DoctorsResponse): Doctor[] {
    return response.doctors.map(resource => this.toEntityFromResource(resource as DoctorResource));
  }

  /**
   * Converts a DoctorResource to a Doctor entity.
   * @param resource - The resource to convert.
   * @returns The converted Doctor entity.
   */
  toEntityFromResource(resource: DoctorResource): Doctor {
    return new Doctor({
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      email: resource.email,
      specialization: resource.specialization,
      cmpCode: resource.cmpCode,
      studyCentre: resource.studyCentre,
      phoneNumber: resource.phoneNumber
    });
  }

  /**
   * Converts a Doctor entity to a DoctorResource.
   * @param entity - The entity to convert.
   * @returns The converted DoctorResource.
   */
  toResourceFromEntity(entity: Doctor): DoctorResource {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      specialization: entity.specialization,
      cmpCode: entity.cmpCode,
      studyCentre: entity.studyCentre,
      phoneNumber: entity.phoneNumber
    } as DoctorResource;
  }
}
