import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {BaseEntity} from '../entities/base-entity';
import {BaseResource, BaseResponse} from '../response/base-response';
import {BaseAssembler} from '../assemblers/base-assembler';



/**
 * Base class for API endpoint operations with generic CRUD functionality.
 * @remarks
 * This class implements the Repository Pattern, providing a consistent interface
 * for CRUD operations across all API endpoints in the application.
 *
 * It handles:
 * - HTTP communication with the backend
 * - Data transformation using Assemblers
 * - Error handling and reporting
 * - Response mapping
 *
 * @template TEntity - The entity type, which must extend BaseEntity
 * @template TResource - The resource type, must extend BaseResource
 * @template TResponse - The response type, must extend BaseResponse
 * @template TAssembler - The assembler type implementing BaseAssembler with matching generics
 *
 * @example
 * ```typescript
 * export class UsersApiEndpoint extends BaseApiEndpoint<
 *   User,
 *   UserResource,
 *   UsersResponse,
 *   UserAssembler
 * > {
 *   constructor(http: HttpClient) {
 *     super(
 *       http,
 *       `${environment.apiBaseUrl}/users`,
 *       new UserAssembler()
 *     );
 *   }
 * }
 * ```
 */
export abstract class BaseApiEndpoint<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse,
  TAssembler extends BaseAssembler<TEntity, TResource, TResponse>
> {
  /**
   * Creates an instance of BaseApiEndpoint.
   * @param http - Angular's HttpClient for making HTTP requests
   * @param endpointUrl - The base URL for this endpoint
   * @param assembler - The assembler instance for data transformation
   */
  constructor(
    protected http: HttpClient,
    protected endpointUrl: string,
    protected assembler: TAssembler
  ) {}

  /**
   * Retrieves all entities from the API, handling both response objects and arrays.
   * @returns An Observable for an array of entities
   * @remarks
   * This method can handle two response formats:
   * 1. An object containing an array (e.g., {users: [...]})
   * 2. A direct array of resources
   *
   * @example
   * ```typescript
   * this.usersEndpoint.getAll().subscribe({
   *   next: (users) => console.log('Users:', users),
   *   error: (err) => console.error('Error:', err)
   * });
   * ```
   */
  getAll(): Observable<TEntity[]> {
    return this.http.get<TResponse | TResource[]>(this.endpointUrl).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map(resource => this.assembler.toEntityFromResource(resource));
        }
        return this.assembler.toEntitiesFromResponse(response as TResponse);
      }),
      catchError(this.handleError('Failed to fetch entities'))
    );
  }

  /**
   * Retrieves a single entity by ID.
   * @param id - The ID of the entity to retrieve
   * @returns An Observable of the entity
   * @remarks
   * Makes a GET request to {endpointUrl}/{id}
   *
   * @example
   * ```typescript
   * this.usersEndpoint.getById(1).subscribe({
   *   next: (user) => console.log('User:', user),
   *   error: (err) => console.error('Error:', err)
   * });
   * ```
   */
  getById(id: number): Observable<TEntity> {
    return this.http.get<TResource>(`${this.endpointUrl}/${id}`).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch entity'))
    );
  }

  /**
   * Creates a new entity.
   * @param entity - The entity to create
   * @returns An Observable of the created entity
   * @remarks
   * Makes a POST request to {endpointUrl} with the entity data
   *
   * @example
   * ```typescript
   * const newUser = new User({...});
   * this.usersEndpoint.create(newUser).subscribe({
   *   next: (created) => console.log('Created:', created),
   *   error: (err) => console.error('Error:', err)
   * });
   * ```
   */
  create(entity: TEntity): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.post<TResource>(this.endpointUrl, resource).pipe(
      map(created => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('Failed to create entity'))
    );
  }

  /**
   * Updates an existing entity.
   * @param entity - The entity to update
   * @param id - The ID of the entity to update
   * @returns An Observable of the updated entity
   * @remarks
   * Makes a PUT request to {endpointUrl}/{id} with the entity data
   *
   * @example
   * ```typescript
   * user.email = 'newemail@example.com';
   * this.usersEndpoint.update(user, user.id).subscribe({
   *   next: (updated) => console.log('Updated:', updated),
   *   error: (err) => console.error('Error:', err)
   * });
   * ```
   */
  update(entity: TEntity, id: number): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.put<TResource>(`${this.endpointUrl}/${id}`, resource).pipe(
      map(updated => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update entity'))
    );
  }

  /**
   * Deletes an entity by ID.
   * @param id - The ID of the entity to delete
   * @returns An Observable of void
   * @remarks
   * Makes a DELETE request to {endpointUrl}/{id}
   *
   * @example
   * ```typescript
   * this.usersEndpoint.delete(1).subscribe({
   *   next: () => console.log('Deleted successfully'),
   *   error: (err) => console.error('Error:', err)
   * });
   * ```
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`).pipe(
      catchError(this.handleError('Failed to delete entity'))
    );
  }

  /**
   * Handles HTTP errors and returns a user-friendly error message.
   * @param operation - The operation that failed
   * @returns A function that transforms an error into an Observable
   * @remarks
   * This method provides centralized error handling and formatting,
   * making errors more user-friendly and consistent across the application.
   *
   * Error handling includes:
   * - 404 errors: Resource not found
   * - Client-side errors: Network or client issues
   * - Server-side errors: Backend problems
   */
  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = operation;
      if (error.status === 404) {
        errorMessage = `${operation}: Resource not found`;
      } else if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `${operation}: ${error.error.message}`;
      } else {
        // Backend returned an unsuccessful response code
        errorMessage = `${operation}: ${error.statusText || 'Unexpected error'}`;
      }
      console.error(errorMessage, error);
      return throwError(() => new Error(errorMessage));
    };
  }
}
