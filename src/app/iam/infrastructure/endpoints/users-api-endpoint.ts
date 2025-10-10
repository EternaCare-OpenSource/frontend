import {BaseApiEndpoint} from '../../../shared/infrastructure/endpoints/base-api-endpoint';
import {User} from '../../domain/model/user.entity';
import {UserResource, UsersResponse} from '../response/user-response';
import {UserAssembler} from '../assemblers/user-assembler';
import {HttpClient} from '@angular/common/http';
import {environmentProduction} from '../../../../environments/environment';

/**
 * API endpoint for managing users.
 */
export class UsersApiEndpoint extends BaseApiEndpoint<User, UserResource, UsersResponse, UserAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environmentProduction.carelinkProviderApiBaseUrl}${environmentProduction.carelinkProviderUsersEndpointPath}`, new UserAssembler());
  }
}
