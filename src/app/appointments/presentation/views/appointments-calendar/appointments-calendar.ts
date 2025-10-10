import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import {AppointmentsStore} from '../../../application/appointments.store';
import {Appointment} from '../../../domain/model/appointment.entity';
import {MatDivider} from '@angular/material/divider';


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
  private appointmentsStore = inject(AppointmentsStore);
  private router = inject(Router);

  readonly appointments = this.appointmentsStore.appointments;
  readonly currentDate = signal(new Date());

  readonly currentMonth = computed(() => this.currentDate().getMonth());
  readonly currentYear = computed(() => this.currentDate().getFullYear());

  readonly monthName = computed(() => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return months[this.currentMonth()];
  });

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

  readonly upcomingAppointments = computed(() => {
    const today = new Date();
    return this.appointments()
      .filter(apt => new Date(apt.appointmentDate) >= today)
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
      .slice(0, 5);
  });

  getAppointmentsForDate(date: Date): Appointment[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.appointments().filter(apt => apt.appointmentDate === dateStr);
  }

  previousMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }

  goToToday(): void {
    this.currentDate.set(new Date());
  }

  createAppointment(): void {
    this.router.navigate(['/appointments/new']);
  }

  viewAppointment(appointment: Appointment): void {
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
}
