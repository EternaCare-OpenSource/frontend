import {BaseResource, BaseResponse} from '../../../shared/infrastructure/response/base-response';


/**
 * Represents a single user resource returned from the API.
 *
 * @remarks
 * This interface extends {@link BaseResource} and includes the core properties of a user.
 */
export interface UserResource extends BaseResource {
  /**
   * Unique identifier for the user.
   */
  id: number;

  /**
   * Email address of the user.
   */
  email: string;

  /**
   * Hashed password of the user.
   */
  password: string;

  /**
   * First name of the user.
   */
  firstName: string;

  /**
   * Last name of the user.
   */
  lastName: string;

  /**
   * Identifier of the assigned role.
   */
  roleId: number;

  /**
   * Indicates if the user account is active.
   */
  isActive: boolean;

  /**
   * Creation date of the user account.
   */
  createdAt: string;
}

/**
 * Represents the response structure for a list of users from the API.
 *
 * @remarks
 * This interface extends {@link BaseResponse} and contains an array of {@link UserResource} objects.
 *
 * @example
 * ```typescript
 * const response: UsersResponse = {
 *   status: 'success',
 *   users: [
 *     { id: 1, email: 'juan@example.com', firstName: 'Juan', ... },
 *     { id: 2, email: 'maria@example.com', firstName: 'Maria', ... }
 *   ]
 * };
 * ```
 */
export interface UsersResponse extends BaseResponse {
  /**
   * Array of user resources included in the response.
   */
  users: UserResource[];
}
