import {RoleResource, RolesResponse} from '../response/role-response';
import {BaseAssembler} from '../../../shared/infrastructure/assemblers/base-assembler';
import {Role} from '../../domain/model/role.entity';


/**
 * Assembler for converting between Role entities, RoleResource resources, and RolesResponse.
 */
export class RoleAssembler implements BaseAssembler<Role, RoleResource, RolesResponse> {

  /**
   * Converts a RolesResponse to an array of Role entities.
   * @param response - The API response containing roles.
   * @returns An array of Role entities.
   */
  toEntitiesFromResponse(response: RolesResponse): Role[] {
    return response.roles.map(resource => this.toEntityFromResource(resource as RoleResource));
  }

  /**
   * Converts a RoleResource to a Role entity.
   * @param resource - The resource to convert.
   * @returns The converted Role entity.
   */
  toEntityFromResource(resource: RoleResource): Role {
    return new Role({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      permissions: resource.permissions
    });
  }

  /**
   * Converts a Role entity to a RoleResource.
   * @param entity - The entity to convert.
   * @returns The converted RoleResource.
   */
  toResourceFromEntity(entity: Role): RoleResource {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      permissions: entity.permissions
    } as RoleResource;
  }
}
