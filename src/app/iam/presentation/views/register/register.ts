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

/**
 * Register Component
 * @description This component handles the registration process for new users.
 * It includes form validation, password matching, and role selection.
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
  private fb = inject(FormBuilder);
  private iamStore = inject(IamStore);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);
  readonly loading = signal(false);
  readonly roles = this.iamStore.roles;

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

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Submit Registration
   * @description This function handles the submission of the registration form.
   * It validates the form, creates a new user, and navigates to the login page on success.
   * If registration fails, it displays an error message using the MatSnackBar service.
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.registerForm.value;

    const newUser = new User({
      id: 0,
      email: formValue.email,
      password: formValue.password,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      roleId: formValue.roleId,
      isActive: true,
      createdAt: new Date().toISOString()
    });

    setTimeout(() => {
      this.iamStore.addUser(newUser);

      this.snackBar.open('Registration successful! Please login.', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      this.loading.set(false);
      this.router.navigate(['/iam/login']);
    }, 1500);
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(value => !value);
  }

  /**
   * Get Error Message
   * @description This function returns the appropriate error message for a given form field.
   * @param field - The name of the form field.
   * @returns The error message for the specified field.
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

  hasError(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
