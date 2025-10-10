
import {Patient} from '../../domain/model/patient.entity';
import {PatientResource, PatientsResponse} from '../response/patient-response';
import {BaseAssembler} from '../../../shared/infrastructure/assemblers/base-assembler';


/**
 * Assembler for converting between Patient entities, PatientResource resources, and PatientsResponse.
 */
export class PatientAssembler implements BaseAssembler<Patient, PatientResource, PatientsResponse> {
  /**
   * Converts a PatientsResponse to an array of Patient entities.
   * @param response - The API response containing patients.
   * @returns An array of Patient entities.
   */
  toEntitiesFromResponse(response: PatientsResponse): Patient[] {
    console.log(response);
    return response.patients.map(resource => this.toEntityFromResource(resource as PatientResource));
  }

  /**
   * Converts a PatientResource to a Patient entity.
   * @param resource - The resource to convert.
   * @returns The converted Patient entity.
   */
  toEntityFromResource(resource: PatientResource): Patient {
    return new Patient({
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      email: resource.email,
      age: resource.age,
      sex: resource.sex,
      bloodType: resource.bloodType,
      patientId: resource.patientId,
      healthInsurance: resource.healthInsurance,
      preferredHospital: resource.preferredHospital,
      status: resource.status,
      assignedDoctorId: resource.assignedDoctorId,
      registerDate: resource.registerDate
    });
  }

  /**
   * Converts a Patient entity to a PatientResource.
   * @param entity - The entity to convert.
   * @returns The converted PatientResource.
   */
  toResourceFromEntity(entity: Patient): PatientResource {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      age: entity.age,
      sex: entity.sex,
      bloodType: entity.bloodType,
      patientId: entity.patientId,
      healthInsurance: entity.healthInsurance,
      preferredHospital: entity.preferredHospital,
      status: entity.status,
      assignedDoctorId: entity.assignedDoctorId,
      registerDate: entity.registerDate
    } as PatientResource;
  }
}
