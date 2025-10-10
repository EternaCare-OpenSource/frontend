import {BaseAssembler} from '../../../shared/infrastructure/assemblers/base-assembler';
import {User} from '../../domain/model/user.entity';
import {UserResource, UsersResponse} from '../response/user-response';


/**
 * Assembler for converting between User entities, UserResource resources, and UsersResponse.
 */
export class UserAssembler implements BaseAssembler<User, UserResource, UsersResponse> {
  /**
   * Converts a UsersResponse to an array of User entities.
   * @param response - The API response containing users.
   * @returns An array of User entities.
   */
  toEntitiesFromResponse(response: UsersResponse): User[] {
    console.log(response);
    return response.users.map(resource => this.toEntityFromResource(resource as UserResource));
  }

  /**
   * Converts a UserResource to a User entity.
   * @param resource - The resource to convert.
   * @returns The converted User entity.
   */
  toEntityFromResource(resource: UserResource): User {
    return new User({
      id: resource.id,
      email: resource.email,
      password: resource.password,
      firstName: resource.firstName,
      lastName: resource.lastName,
      roleId: resource.roleId,
      isActive: resource.isActive,
      createdAt: resource.createdAt
    });
  }

  /**
   * Converts a User entity to a UserResource.
   * @param entity - The entity to convert.
   * @returns The converted UserResource.
   */
  toResourceFromEntity(entity: User): UserResource {
    return {
      id: entity.id,
      email: entity.email,
      password: entity.password,
      firstName: entity.firstName,
      lastName: entity.lastName,
      roleId: entity.roleId,
      isActive: entity.isActive,
      createdAt: entity.createdAt
    } as UserResource;
  }
}
