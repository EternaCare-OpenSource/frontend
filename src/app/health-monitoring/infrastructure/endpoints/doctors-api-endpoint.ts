
import {HttpClient} from '@angular/common/http';
import {Doctor} from '../../domain/model/doctor.entity';
import {DoctorResource, DoctorsResponse} from '../response/doctor-response';
import {DoctorAssembler} from '../assemblers/doctor-assembler';
import {environmentProduction} from '../../../../environments/environment';
import {BaseApiEndpoint} from '../../../shared/infrastructure/endpoints/base-api-endpoint';


/**
 * API endpoint for managing doctors.
 */
export class DoctorsApiEndpoint extends BaseApiEndpoint<Doctor, DoctorResource, DoctorsResponse, DoctorAssembler> {
  /**
   * Creates an instance of DoctorsApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environmentProduction.carelinkProviderApiBaseUrl}${environmentProduction.carelinkProviderDoctorsEndpointPath}`, new DoctorAssembler());
  }
}
