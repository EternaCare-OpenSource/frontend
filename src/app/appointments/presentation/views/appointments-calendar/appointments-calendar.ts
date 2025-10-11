import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AppointmentsStore } from '../../../application/appointments.store';
import { Appointment } from '../../../domain/model/appointment.entity';
import { MatDivider } from '@angular/material/divider';

/**
 * Interface representing a single day in the calendar,
 * including metadata and associated appointments.
 */
interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
}

@Component({
  selector: 'app-appointments-calendar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatDivider
  ],
  templateUrl: './appointments-calendar.html',
  styleUrls: ['./appointments-calendar.css']
})
export class AppointmentsCalendar {
  /**
   * Injects stores and router for dependency management.
   */
  private appointmentsStore = inject(AppointmentsStore);
  private router = inject(Router);

  /**
   * Reactive signals representing appointment data and current date.
   */
  readonly appointments = this.appointmentsStore.appointments;
  readonly currentDate = signal(new Date());

  /**
   * Computed signal returning the current month (0–11).
   */
  readonly currentMonth = computed(() => this.currentDate().getMonth());

  /**
   * Computed signal returning the current year.
   */
  readonly currentYear = computed(() => this.currentDate().getFullYear());

  /**
   * Computed signal returning the current month's name.
   */
  readonly monthName = computed(() => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[this.currentMonth()];
  });

  /**
   * Computed signal generating a 6x7 calendar grid.
   * Includes days from the previous and next month to fill 42 days total.
   * Each day includes appointment data and "today" status.
   */
  readonly calendarDays = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        dayNumber: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        appointments: this.getAppointmentsForDate(date)
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        appointments: this.getAppointmentsForDate(date)
      });
    }

    // Add next month's leading days to complete the grid (42 total)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: false,
        appointments: this.getAppointmentsForDate(date)
      });
    }

    return days;
  });

  /**
   * Computed signal returning the next 5 upcoming appointments sorted by date.
   */
  readonly upcomingAppointments = computed(() => {
    const today = new Date();
    return this.appointments()
      .filter(apt => new Date(apt.appointmentDate) >= today)
      .sort((a, b) =>
        new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
      )
      .slice(0, 5);
  });

  /**
   * Retrieves all appointments matching the given date.
   * @param date - Date to filter appointments by.
   * @returns Array of appointments scheduled for that date.
   */
  getAppointmentsForDate(date: Date): Appointment[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.appointments().filter(apt => apt.appointmentDate === dateStr);
  }

  /**
   * Navigates to the previous month.
   */
  previousMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  }

  /**
   * Navigates to the next month.
   */
  nextMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }

  /**
   * Resets the calendar view to the current date.
   */
  goToToday(): void {
    this.currentDate.set(new Date());
  }

  /**
   * Navigates to the appointment creation page.
   */
  createAppointment(): void {
    this.router.navigate(['/appointments/new']);
  }

  /**
   * Navigates to the edit page for a selected appointment.
   * @param appointment - Appointment to view or edit.
   */
  viewAppointment(appointment: Appointment): void {
    this.router.navigate(['/appointments/edit', appointment.id]);
  }

  /**
   * Deletes a selected appointment after confirmation.
   * @param appointment - Appointment to delete.
   */
  deleteAppointment(appointment: Appointment): void {
    if (confirm(`Delete appointment with ${appointment.patientName}?`)) {
      this.appointmentsStore.deleteAppointment(appointment.id);
    }
  }

  /**
   * Returns a color identifier based on the appointment's status.
   * Used for consistent UI chip coloring.
   * @param status - Appointment status string.
   * @returns Material color palette key.
   */
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Scheduled': 'primary',
      'Completed': 'accent',
      'Cancelled': 'warn',
      'No-Show': 'warn'
    };
    return colors[status] || '';
  }
}
