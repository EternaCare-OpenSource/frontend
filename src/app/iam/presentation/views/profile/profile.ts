import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {HealthMonitoringStore} from '../../../../health-monitoring/application/health-monitoring.store';
import {IamStore} from '../../../application/iam.store';
import {AppointmentsStore} from '../../../../appointments/application/appointments.store';
import {MessagingStore} from '../../../../messaging/application/messaging.store';

/**
 * Profile Component
 * @description This component handles the profile management functionality for the application.
 * It includes functionality to edit profile details, change password, manage notification settings,
 * and manage privacy settings.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  private fb = inject(FormBuilder);
  private iamStore = inject(IamStore);
  private healthMonitoringStore = inject(HealthMonitoringStore);
  private appointmentsStore = inject(AppointmentsStore);
  private messagingStore = inject(MessagingStore);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  readonly currentUser = this.iamStore.currentUser;
  readonly isEditing = signal(false);
  readonly loading = signal(false);

  /**
   * User Stats
   * @description This computed signal returns the user statistics based on the current user's role.
   * @returns An object containing user statistics for the current user's role.
   */
  readonly userStats = computed(() => {
    const role = this.currentUser()?.role?.name;

    if (role === 'Doctor') {
      return {
        patients: this.healthMonitoringStore.patientCount(),
        appointments: this.appointmentsStore.appointmentCount(),
        schedules: this.appointmentsStore.scheduleCount(),
        messages: this.messagingStore.messageCount()
      };
    } else if (role === 'Patient') {
      const userEmail = this.currentUser()?.email;
      const userAppointments = this.appointmentsStore.appointments()
        .filter(apt => apt.patientName?.includes(this.currentUser()?.firstName || ''));

      return {
        appointments: userAppointments.length,
        upcomingAppointments: userAppointments.filter(apt =>
          new Date(apt.appointmentDate) >= new Date()
        ).length,
        messages: this.messagingStore.unreadCount(),
        reports: 0
      };
    }

    return {
      users: this.iamStore.userCount(),
      doctors: this.healthMonitoringStore.doctorCount(),
      patients: this.healthMonitoringStore.patientCount(),
      appointments: this.appointmentsStore.appointmentCount()
    };
  });

  profileForm: FormGroup = this.fb.group({
    firstName: [{ value: '', disabled: true }, [Validators.required]],
    lastName: [{ value: '', disabled: true }, [Validators.required]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    currentPassword: [''],
    newPassword: ['', [Validators.minLength(6)]],
    confirmPassword: ['', [Validators.minLength(6)]]
  });

  notificationSettings = signal({
    emailNotifications: true,
    appointmentReminders: true,
    messageAlerts: true,
    reportAlerts: true,
    weeklyDigest: false
  });

  privacySettings = signal({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    dataSharing: true
  });

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }
  }

  toggleEdit(): void {
    this.isEditing.update(v => !v);

    if (this.isEditing()) {
      this.profileForm.get('firstName')?.enable();
      this.profileForm.get('lastName')?.enable();
    } else {
      this.profileForm.get('firstName')?.disable();
      this.profileForm.get('lastName')?.disable();
      this.loadUserData();
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    setTimeout(() => {
      this.snackBar.open('Profile updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      this.loading.set(false);
      this.toggleEdit();
    }, 1000);
  }

  changePassword(): void {
    const current = this.profileForm.get('currentPassword')?.value;
    const newPass = this.profileForm.get('newPassword')?.value;
    const confirm = this.profileForm.get('confirmPassword')?.value;

    if (!current || !newPass || !confirm) {
      this.snackBar.open('Please fill all password fields', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (newPass !== confirm) {
      this.snackBar.open('Passwords do not match', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.snackBar.open('Password changed successfully!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });

    this.profileForm.patchValue({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }

  saveNotificationSettings(): void {
    this.snackBar.open('Notification settings saved!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  savePrivacySettings(): void {
    this.snackBar.open('Privacy settings saved!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.snackBar.open('Account deletion initiated', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  getRoleBadgeColor(): string {
    const role = this.currentUser()?.role?.name;
    const colors: { [key: string]: string } = {
      'Patient': '#4caf50',
      'Doctor': '#2196f3',
      'Family': '#ff9800',
      'Admin': '#f44336'
    };
    return colors[role || ''] || '#666';
  }

  getErrorMessage(field: string): string {
    const control = this.profileForm.get(field);
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
