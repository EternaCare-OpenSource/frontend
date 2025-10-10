import {BaseEntity} from '../entities/base-entity';
import {BaseResource, BaseResponse} from '../response/base-response';


/**
 * Defines a contract for assembler classes that convert between entities, resources, and API responses.
 * @remarks
 * Assemblers follow the Assembler Pattern (also known as Mapper Pattern) and are responsible
 * for converting between different representations of data:
 * - Entity: Domain model used in business logic
 * - Resource: DTO used in API communication
 * - Response: API response structure
 *
 * This pattern helps maintain separation of concerns and allows the domain model
 * to evolve independently from the API contract.
 *
 * @template TEntity - The entity type (domain model), must extend BaseEntity
 * @template TResource - The resource type (DTO), must extend BaseResource
 * @template TResponse - The response type (API response), must extend BaseResponse
 *
 * @example
 * ```typescript
 * export class UserAssembler implements BaseAssembler<User, UserResource, UsersResponse> {
 *   toEntityFromResource(resource: UserResource): User {
 *     return new User({
 *       id: resource.id,
 *       email: resource.email,
 *       firstName: resource.firstName,
 *       lastName: resource.lastName
 *     });
 *   }
 *
 *   toResourceFromEntity(entity: User): UserResource {
 *     return {
 *       id: entity.id,
 *       email: entity.email,
 *       firstName: entity.firstName,
 *       lastName: entity.lastName
 *     } as UserResource;
 *   }
 *
 *   toEntitiesFromResponse(response: UsersResponse): User[] {
 *     return response.users.map(resource => this.toEntityFromResource(resource));
 *   }
 * }
 * ```
 */
export interface BaseAssembler<TEntity extends BaseEntity, TResource extends BaseResource, TResponse extends BaseResponse> {
  /**
   * Converts a resource (DTO) to a domain entity.
   * @param resource - The API resource to convert
   * @returns The converted domain entity
   * @remarks
   * This method is used when receiving data from the API and converting it
   * to the domain model for use in business logic.
   */
  toEntityFromResource(resource: TResource): TEntity;

  /**
   * Converts a domain entity to a resource (DTO).
   * @param entity - The domain entity to convert
   * @returns The converted API resource
   * @remarks
   * This method is used when sending data to the API, converting from
   * the domain model to the API's expected format.
   */
  toResourceFromEntity(entity: TEntity): TResource;

  /**
   * Converts an API response containing multiple resources to an array of domain entities.
   * @param response - The API response containing a collection of resources
   * @returns An array of domain entities
   * @remarks
   * This method is typically used when receiving a list of items from the API,
   * such as a GET all endpoint response.
   */
  toEntitiesFromResponse(response: TResponse): TEntity[];
}
