import {BaseEntity} from '../../../shared/infrastructure/entities/base-entity';


/**
 * Represents a Role entity in the application.
 * @remarks
 * This class is used as a domain model for roles in the IAM context.
 * It implements the BaseEntity interface to ensure consistency across entities.
 * @see {@link BaseEntity}
 */
export class Role implements BaseEntity {
  /**
   * Creates a new Role instance.
   * @param role - An object containing the role's information.
   * @returns A new instance of Role.
   */
  constructor(role: {
    id: number;
    name: string;
    description: string;
    permissions: string[];
  }) {
    this._id = role.id;
    this._name = role.name;
    this._description = role.description;
    this._permissions = role.permissions;
  }

  /**
   * The unique identifier for the role.
   */
  private _id: number;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  /**
   * The name of the role (e.g., Patient, Doctor, Admin, Family).
   */
  private _name: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  /**
   * The description of the role.
   */
  private _description: string;

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  /**
   * The permissions associated with this role.
   */
  private _permissions: string[];

  get permissions(): string[] {
    return this._permissions;
  }

  set permissions(value: string[]) {
    this._permissions = value;
  }
}
