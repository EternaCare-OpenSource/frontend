import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {forkJoin, retry} from 'rxjs';
import {User} from '../domain/model/user.entity';
import {Role} from '../domain/model/role.entity';
import {IamApi} from '../infrastructure/api/iam-api';
import {TokenService} from '../../shared/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class IamStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly tokenService = inject(TokenService);

  readonly userCount = computed(() => this.users().length);
  readonly roleCount = computed(() => this.roles().length);

  private readonly usersSignal = signal<User[]>([]);
  readonly users = this.usersSignal.asReadonly();

  private readonly rolesSignal = signal<Role[]>([]);
  readonly roles = this.rolesSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly currentUser = computed(() => {
    const tokenUser = this.tokenService.currentUser();
    if (!tokenUser) return null;
    return this.users().find(u => u.id === tokenUser.id) || null;
  });

  readonly isAuthenticated = computed(() => this.tokenService.hasUser());

  constructor(private iamApi: IamApi) {
    this.loadData();
  }

  getRoleById(id: number): Signal<Role | undefined> {
    return computed(() =>
      id !== undefined && id !== null
        ? this.roles().find(r => r.id === id)
        : undefined
    );
  }

  getUserById(id: number): Signal<User | undefined> {
    return computed(() =>
      id !== undefined && id !== null
        ? this.users().find(u => u.id === id)
        : undefined
    );
  }

  login(email: string, password: string): boolean {
    const user = this.users().find(u => u.email === email && u.password === password);
    if (user) {
      const roleName = user.role?.name || '';
      this.tokenService.setCurrentUser({
        id: user.id,
        email: user.email,
        role: roleName
      });
      return true;
    }
    return false;
  }

  logout(): void {
    this.tokenService.clearCurrentUser();
  }

  addUser(user: User): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.createUser(user)
      .pipe(
        retry(2),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: createdUser => {
          const userWithRole = this.assignRoleToUser(createdUser);
          this.usersSignal.update(users => [...users, userWithRole]);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to create user'));
          this.loadingSignal.set(false);
        }
      });
  }

  updateUser(updatedUser: User): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.updateUser(updatedUser)
      .pipe(
        retry(2),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: user => {
          const userWithRole = this.assignRoleToUser(user);
          this.usersSignal.update(users =>
            users.map(u => u.id === userWithRole.id ? userWithRole : u)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to update user'));
          this.loadingSignal.set(false);
        }
      });
  }

  deleteUser(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.deleteUser(id)
      .pipe(
        retry(2),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.usersSignal.update(users => users.filter(u => u.id !== id));
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to delete user'));
          this.loadingSignal.set(false);
        }
      });
  }

  addRole(role: Role): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.createRole(role)
      .pipe(
        retry(2),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: createdRole => {
          this.rolesSignal.update(roles => [...roles, createdRole]);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to create role'));
          this.loadingSignal.set(false);
        }
      });
  }

  updateRole(updatedRole: Role): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.updateRole(updatedRole)
      .pipe(
        retry(2),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: role => {
          this.rolesSignal.update(roles =>
            roles.map(r => r.id === role.id ? role : r)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to update role'));
          this.loadingSignal.set(false);
        }
      });
  }

  deleteRole(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.deleteRole(id)
      .pipe(
        retry(2),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.rolesSignal.update(roles => roles.filter(r => r.id !== id));
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to delete role'));
          this.loadingSignal.set(false);
        }
      });
  }

  private loadData(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    forkJoin({
      roles: this.iamApi.getRoles(),
      users: this.iamApi.getUsers()
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({roles, users}) => {
          this.rolesSignal.set(roles);
          this.usersSignal.set(users);
          this.assignRolesToUsers();
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load data'));
          this.loadingSignal.set(false);
        }
      });
  }

  private assignRolesToUsers(): void {
    this.usersSignal.update(users =>
      users.map(user => this.assignRoleToUser(user))
    );
  }

  private assignRoleToUser(user: User): User {
    const roleId = user.roleId ?? 0;
    const role = roleId ? this.getRoleById(roleId)() ?? null : null;

    return new User({
      id: user.id,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      role: role
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}
