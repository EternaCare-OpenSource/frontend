import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IamStore } from '../../../application/iam.store';

/**
 *
 * Login page with reactive form, validation, and feedback via MatSnackBar.
 * Uses IamStore for authentication and Router for navigation.
 */
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  /**
   *
   * DI: form builder, auth store, router, and snackbar.
   */
  private fb = inject(FormBuilder);
  private iamStore = inject(IamStore);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  /**
   *
   * UI state signals.
   */
  readonly hidePassword = signal(true);
  readonly loading = signal(false);

  /**
   *
   * Reactive login form with validators.
   */
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  /**
   *
   * Handles form submission: validates, attempts login, and navigates or shows error.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { email, password } = this.loginForm.value;

    this.iamStore.login(email, password).subscribe({
      next: (success) => {
        if (success) {
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/home']);
        } else {
          this.snackBar.open('Invalid credentials', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: () => {
        this.snackBar.open('Unexpected error during login', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  /**
   *
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  /**
   *
   * Returns a human-friendly validation message for a given field.
   * @param field Form control name ('email' | 'password').
   * @returns Error string or empty when valid.
   */
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);

    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }
}
