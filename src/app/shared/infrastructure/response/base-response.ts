/**
 * Abstract interface for API response structures.
 * @remarks
 * This interface serves as a base for all API responses in the application.
 * It can be extended with additional properties as needed by specific endpoints.
 *
 * @example
 * ```typescript
 * export interface UsersResponse extends BaseResponse {
 *   users: UserResource[];
 * }
 * ```
 */
export interface BaseResponse {
  /**
   * Optional status field for API responses.
   * @remarks
   * Can be used to indicate success, error, or other status information.
   */
  status?: string;

  /**
   * Optional message field for API responses.
   * @remarks
   * Can be used to provide additional information about the response.
   */
  message?: string;
}

/**
 * Defines a standard structure for API resources/DTOs with a unique identifier.
 * @remarks
 * All API resources (DTOs) should implement this interface to ensure consistency
 * when transferring data between the frontend and backend.
 *
 * Resources are the data transfer objects that represent how data is structured
 * in API requests and responses.
 *
 * @example
 * ```typescript
 * export interface UserResource extends BaseResource {
 *   id: number;
 *   email: string;
 *   firstName: string;
 *   lastName: string;
 * }
 * ```
 */
export interface BaseResource {
  /**
   * The unique identifier for the resource.
   * @remarks
   * This ID should correspond to the entity's ID in the database.
   */
  id: number;
}
