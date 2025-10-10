import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { AppointmentsStore } from '../../../application/appointments.store';
import { Appointment } from '../../../domain/model/appointment.entity';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule,
    MatTableModule
  ],
  templateUrl: './appointments-list.html',
  styleUrl: './appointments-list.css'
})
export class AppointmentsList {
  private appointmentsStore = inject(AppointmentsStore);
  private router = inject(Router);

  readonly appointments = this.appointmentsStore.appointments;
  readonly loading = this.appointmentsStore.loading;
  readonly searchQuery = signal('');

  readonly filteredAppointments = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.appointments();

    return this.appointments().filter(apt =>
      apt.patientName?.toLowerCase().includes(query) ||
      apt.doctorName?.toLowerCase().includes(query) ||
      apt.reason.toLowerCase().includes(query) ||
      apt.status.toLowerCase().includes(query)
    );
  });

  readonly displayedColumns: string[] = [
    'date',
    'time',
    'patient',
    'doctor',
    'reason',
    'status',
    'actions'
  ];

  readonly upcomingAppointments = computed(() => {
    const today = new Date();
    return this.filteredAppointments()
      .filter(apt => new Date(apt.appointmentDate) >= today)
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  });

  readonly pastAppointments = computed(() => {
    const today = new Date();
    return this.filteredAppointments()
      .filter(apt => new Date(apt.appointmentDate) < today)
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
  });

  createAppointment(): void {
    this.router.navigate(['/appointments/new']);
  }

  viewAppointment(appointment: Appointment): void {
    this.router.navigate(['/appointments/edit', appointment.id]);
  }

  editAppointment(appointment: Appointment): void {
    this.router.navigate(['/appointments/edit', appointment.id]);
  }

  deleteAppointment(appointment: Appointment): void {
    if (confirm(`Delete appointment with ${appointment.patientName}?`)) {
      this.appointmentsStore.deleteAppointment(appointment.id);
    }
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Scheduled': 'primary',
      'Completed': 'accent',
      'Cancelled': 'warn',
      'No-Show': 'warn'
    };
    return colors[status] || '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
