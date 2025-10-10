import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {BaseApi} from '../../../shared/infrastructure/api/base-api';
import {UsersApiEndpoint} from '../endpoints/users-api-endpoint';
import {RolesApiEndpoint} from '../endpoints/roles-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {User} from '../../domain/model/user.entity';
import {Role} from '../../domain/model/role.entity';

/**
 * API service for managing endpoints in the IAM context (users and roles).
 */
@Injectable({providedIn: 'root'})
export class IamApi extends BaseApi {
  private readonly usersEndpoint: UsersApiEndpoint;
  private readonly rolesEndpoint: RolesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.usersEndpoint = new UsersApiEndpoint(http);
    this.rolesEndpoint = new RolesApiEndpoint(http);
  }

  /**
   * Retrieves all users from the API.
   * @returns An Observable for an array of User objects.
   */
  getUsers(): Observable<User[]> {
    return this.usersEndpoint.getAll();
  }

  /**
   * Retrieves a single user by ID.
   * @param id - The ID of the user.
   * @returns An Observable of the User object.
   */
  getUser(id: number): Observable<User> {
    return this.usersEndpoint.getById(id);
  }

  /**
   * Creates a new user.
   * @param user - The user to create.
   * @returns An Observable of the created User object.
   */
  createUser(user: User): Observable<User> {
    return this.usersEndpoint.create(user);
  }

  /**
   * Updates an existing user.
   * @param user - The user to update.
   * @returns An Observable of the updated User object.
   */
  updateUser(user: User): Observable<User> {
    return this.usersEndpoint.update(user, user.id);
  }

  /**
   * Deletes a user by ID.
   * @param id - The ID of the user to delete.
   * @returns An Observable of void.
   */
  deleteUser(id: number): Observable<void> {
    return this.usersEndpoint.delete(id);
  }

  /**
   * Retrieves all roles from the API.
   * @returns An Observable for an array of Role objects.
   */
  getRoles(): Observable<Role[]> {
    return this.rolesEndpoint.getAll();
  }

  /**
   * Retrieves a single role by ID.
   * @param id - The ID of the role.
   * @returns An Observable of the Role object.
   */
  getRole(id: number): Observable<Role> {
    return this.rolesEndpoint.getById(id);
  }

  /**
   * Creates a new role.
   * @param role - The role to create.
   * @returns An Observable of the created Role object.
   */
  createRole(role: Role): Observable<Role> {
    return this.rolesEndpoint.create(role);
  }

  /**
   * Updates an existing role.
   * @param role - The role to update.
   * @returns An Observable of the updated Role object.
   */
  updateRole(role: Role): Observable<Role> {
    return this.rolesEndpoint.update(role, role.id);
  }

  /**
   * Deletes a role by ID.
   * @param id - The ID of the role to delete.
   * @returns An Observable of void.
   */
  deleteRole(id: number): Observable<void> {
    return this.rolesEndpoint.delete(id);
  }
}
