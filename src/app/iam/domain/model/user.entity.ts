import {Role} from './role.entity';

/**
 * Represents a User entity in the application.
 * @remarks
 * This class is used as a domain model for users in the IAM context.
 * It encapsulates the properties and behaviors associated with a user, including their role assignment.
 *
 * @example
 * ```typescript
 * const user = new User({
 *   id: 1,
 *   email: 'juan@example.com',
 *   password: 'hashedPassword123',
 *   firstName: 'Juan',
 *   lastName: 'Gonzales',
 *   roleId: 1,
 *   isActive: true,
 *   createdAt: '2025-01-15'
 * });
 * console.log(user.fullName); // Output: Juan Gonzales
 * ```
 */
export class User {
  /**
   * The role assigned to the user.
   * @remarks
   * This is an object reference to the {@link Role} entity. It may be null if not set.
   */
  get role(): Role | null {
    return this._role;
  }

  /**
   * Sets the role assigned to the user.
   *
   * @param value - The {@link Role} to assign to the user.
   */
  set role(value: Role | null) {
    this._role = value;
  }

  /**
   * Unique identifier for the user.
   * @defaultValue 0
   */
  private _id: number;

  /**
   * Email address of the user.
   * @defaultValue ''
   */
  private _email: string;

  /**
   * Hashed password of the user.
   * @defaultValue ''
   */
  private _password: string;

  /**
   * First name of the user.
   * @defaultValue ''
   */
  private _firstName: string;

  /**
   * Last name of the user.
   * @defaultValue ''
   */
  private _lastName: string;

  /**
   * Identifier of the assigned role.
   * @defaultValue 0
   */
  private _roleId: number;

  /**
   * Indicates if the user account is active.
   * @defaultValue true
   */
  private _isActive: boolean;

  /**
   * Creation date of the user account.
   * @defaultValue ''
   */
  private _createdAt: string;

  /**
   * The role object assigned to the user, or null if not set.
   * @defaultValue null
   */
  private _role: Role | null;

  /**
   * Creates a new instance of the User class.
   *
   * @param user - An object containing properties to initialize the user.
   */
  constructor(user: {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId: number;
    isActive: boolean;
    createdAt: string;
    role?: Role | null;
  }) {
    this._id = user.id;
    this._email = user.email;
    this._password = user.password;
    this._firstName = user.firstName;
    this._lastName = user.lastName;
    this._roleId = user.roleId;
    this._isActive = user.isActive;
    this._createdAt = user.createdAt;
    this._role = user.role ?? null;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get roleId(): number {
    return this._roleId;
  }

  set roleId(value: number) {
    this._roleId = value;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  set createdAt(value: string) {
    this._createdAt = value;
  }

  /**
   * Gets the full name of the user.
   * @returns The full name (firstName + lastName).
   */
  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }
}
