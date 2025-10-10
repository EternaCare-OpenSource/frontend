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
import {IamStore} from '../../../application/iam.store';


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
  private fb = inject(FormBuilder);
  private iamStore = inject(IamStore);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly hidePassword = signal(true);
  readonly loading = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { email, password } = this.loginForm.value;

    setTimeout(() => {
      const success = this.iamStore.login(email, password);

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

      this.loading.set(false);
    }, 1000);
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

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
