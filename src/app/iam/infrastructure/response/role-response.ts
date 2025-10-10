import {BaseResource, BaseResponse} from '../../../shared/infrastructure/response/base-response';


/**
 * Represents the API resource/DTO for a role.
 */
export interface RoleResource extends BaseResource {
  /**
   * The unique identifier for the role.
   */
  id: number;

  /**
   * The name of the role.
   */
  name: string;

  /**
   * The description of the role.
   */
  description: string;

  /**
   * The permissions associated with this role.
   */
  permissions: string[];
}

/**
 * Represents the API response structure for a list of roles.
 */
export interface RolesResponse extends BaseResponse {
  /**
   * The list of roles returned by the API.
   */
  roles: RoleResource[];
}
