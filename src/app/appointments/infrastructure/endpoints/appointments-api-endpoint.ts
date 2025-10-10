import {BaseApiEndpoint} from '../../../shared/infrastructure/endpoints/base-api-endpoint';
import {Appointment} from '../../domain/model/appointment.entity';
import {AppointmentResource, AppointmentsResponse} from '../response/appointment-response';
import {AppointmentAssembler} from '../assemblers/appointment-assembler';
import {HttpClient} from '@angular/common/http';
import {environmentProduction} from '../../../../environments/environment';


/**
 * API endpoint for managing appointments.
 */
export class AppointmentsApiEndpoint extends BaseApiEndpoint<Appointment, AppointmentResource, AppointmentsResponse, AppointmentAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environmentProduction.carelinkProviderApiBaseUrl}${environmentProduction.carelinkProviderAppointmentsEndpointPath}`, new AppointmentAssembler());
  }
}
