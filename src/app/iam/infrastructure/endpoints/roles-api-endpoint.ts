import {BaseApiEndpoint} from '../../../shared/infrastructure/endpoints/base-api-endpoint';
import {Role} from '../../domain/model/role.entity';
import {RoleResource, RolesResponse} from '../response/role-response';
import {RoleAssembler} from '../assemblers/role-assembler';
import {HttpClient} from '@angular/common/http';
import {environmentProduction} from '../../../../environments/environment';


/**
 * API endpoint for managing roles.
 */
export class RolesApiEndpoint extends BaseApiEndpoint<Role, RoleResource, RolesResponse, RoleAssembler> {
  /**
   * Creates an instance of RolesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environmentProduction.carelinkProviderApiBaseUrl}${environmentProduction.carelinkProviderRolesEndpointPath}`, new RoleAssembler());
  }
}
