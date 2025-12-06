import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IamStore } from '../../../application/iam.store';
import { User } from '../../../domain/model/user.entity';
import { AuthApi } from '../../../infrastructure/api/auth-api';

/**
 *
 * Registration page for new users with validation, password match, and role selection.
 * Uses reactive forms and Angular Material; persists via IamStore mock flow.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  /**
   *
   * DI: form builder, store, router, and snackbar.
   */
  private fb = inject(FormBuilder);
  private iamStore = inject(IamStore);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private readonly authApi = inject(AuthApi);

  /**
   *
   * UI state signals for password visibility and loading.
   */
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);
  readonly loading = signal(false);

  /**
   *
   * Available roles to populate the role selector.
   */
  readonly roles = this.iamStore.roles;

  /**
   *
   * Registration form group with validators and cross-field password matcher.
   */
  registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    roleId: [0, [Validators.required, Validators.min(1)]],
    acceptTerms: [false, [Validators.requiredTrue]]
  }, {
    validators: this.passwordMatchValidator
  });

  /**
   *
   * Cross-field validator to ensure password and confirmPassword match.
   * @param control Root form group.
   * @returns ValidationErrors when mismatched; otherwise null.
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) return null;
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   *
   * Submits the registration form, creates a new user, and redirects to login (mocked).
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.registerForm.value;

    const payload = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      // según tu lógica de roles en el form:
      roles: formValue.roleId ? [formValue.roleId] : undefined
      // por ejemplo, si roleId tiene "DOCTOR" / "PATIENT"
    };

    this.authApi.register(payload).subscribe({
      next: () => {
        this.snackBar.open('Registration successful! Please login.', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/iam/login']);
      },
      error: (error) => {
        if (error.status === 409) {
          this.snackBar.open('Email already registered', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        } else {
          this.snackBar.open('Registration failed', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  /**
   *
   * Toggles visibility of the password field.
   */
  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  /**
   *
   * Toggles visibility of the confirm password field.
   */
  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(value => !value);
  }

  /**
   *
   * Returns a user-friendly validation message for the specified field.
   * @param field Form control name.
   * @returns Error string or empty when valid.
   */
  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);

    if (control?.hasError('required')) {
      return `${this.getFieldLabel(field)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `${this.getFieldLabel(field)} must be at least ${minLength} characters`;
    }
    if (control?.hasError('min')) {
      return `Please select a ${this.getFieldLabel(field).toLowerCase()}`;
    }
    if (field === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  /**
   *
   * Maps form control keys to human-friendly labels.
   * @param field Form control name.
   * @returns Label string.
   */
  getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      roleId: 'Role'
    };
    return labels[field] || field;
  }

  /**
   *
   * Indicates whether a control is both invalid and touched.
   * @param field Form control name.
   * @returns True if control shows an error state, otherwise false.
   */
  hasError(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
