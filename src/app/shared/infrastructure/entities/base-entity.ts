/**
 * Defines a standard structure for entities with a unique identifier.
 * @remarks
 * All domain entities should implement this interface to ensure consistency
 * across the application.
 *
 * @example
 * ```typescript
 * export class User implements BaseEntity {
 *   private _id: number;
 *
 *   get id(): number {
 *     return this._id;
 *   }
 *
 *   set id(value: number) {
 *     this._id = value;
 *   }
 * }
 * ```
 */
export interface BaseEntity {
  /**
   * The unique identifier for the entity.
   * @remarks
   * This should be a positive integer that uniquely identifies the entity
   * within its bounded context.
   */
  id: number;
}
