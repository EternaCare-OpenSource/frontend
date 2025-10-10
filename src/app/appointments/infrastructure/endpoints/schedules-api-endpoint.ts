import {BaseApiEndpoint} from '../../../shared/infrastructure/endpoints/base-api-endpoint';
import {Schedule} from '../../domain/model/schedule.entity';
import {ScheduleResource, SchedulesResponse} from '../response/schedule-response';
import {ScheduleAssembler} from '../assemblers/schedule-assembler';
import {HttpClient} from '@angular/common/http';
import {environmentProduction} from '../../../../environments/environment';


/**
 * API endpoint for managing schedules.
 */
export class SchedulesApiEndpoint extends BaseApiEndpoint<Schedule, ScheduleResource, SchedulesResponse, ScheduleAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environmentProduction.carelinkProviderApiBaseUrl}${environmentProduction.carelinkProviderSchedulesEndpointPath}`, new ScheduleAssembler());
  }
}
