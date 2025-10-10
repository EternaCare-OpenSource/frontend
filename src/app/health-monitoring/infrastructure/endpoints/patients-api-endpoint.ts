
import {Patient} from '../../domain/model/patient.entity';
import {PatientResource, PatientsResponse} from '../response/patient-response';
import {PatientAssembler} from '../assemblers/patient-assembler';
import {HttpClient} from '@angular/common/http';
import {environmentProduction} from '../../../../environments/environment';
import {BaseApiEndpoint} from '../../../shared/infrastructure/endpoints/base-api-endpoint';

/**
 * API endpoint for managing patients.
 */
export class PatientsApiEndpoint extends BaseApiEndpoint<Patient, PatientResource, PatientsResponse, PatientAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environmentProduction.carelinkProviderApiBaseUrl}${environmentProduction.carelinkProviderPatientsEndpointPath}`, new PatientAssembler());
  }
}
