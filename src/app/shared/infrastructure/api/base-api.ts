/**
 * Abstract base class for API services managing multiple endpoints within a bounded context.
 * @remarks
 * This class serves as a foundation for API services that coordinate multiple related endpoints.
 * It follows the Facade Pattern, providing a unified interface for interacting with related
 * API endpoints within a bounded context.
 *
 * Child classes should compose endpoint instances (extending BaseApiEndpoint) and expose
 * methods that delegate to these endpoints.
 *
 * @example
 * ```typescript
 * @Injectable({providedIn: 'root'})
 * export class LearningApi extends BaseApi {
 *   private readonly coursesEndpoint: CoursesApiEndpoint;
 *   private readonly categoriesEndpoint: CategoriesApiEndpoint;
 *
 *   constructor(http: HttpClient) {
 *     super();
 *     this.coursesEndpoint = new CoursesApiEndpoint(http);
 *     this.categoriesEndpoint = new CategoriesApiEndpoint(http);
 *   }
 *
 *   getCourses(): Observable<Course[]> {
 *     return this.coursesEndpoint.getAll();
 *   }
 *
 *   getCategories(): Observable<Category[]> {
 *     return this.categoriesEndpoint.getAll();
 *   }
 * }
 * ```
 */
export abstract class BaseApi {
  /**
   * Protected constructor to prevent direct instantiation.
   * @remarks
   * This class should only be extended, not instantiated directly.
   */
  protected constructor() {
    // No implementation needed - child classes will compose endpoint instances
  }
}
