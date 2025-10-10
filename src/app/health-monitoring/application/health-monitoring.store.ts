import {computed, Injectable, Signal, signal} from '@angular/core';
import {Patient} from '../domain/model/patient.entity';
import {Doctor} from '../domain/model/doctor.entity';

import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {HealthMonitoringApi} from '../infrastructure/api/health-monitoring-api';

/**
 * State management store for patients and doctors using Angular signals.
 */
@Injectable({
  providedIn: 'root'
})
export class HealthMonitoringStore {
  readonly patientCount = computed(() => this.patients().length);
  readonly doctorCount = computed(() => this.doctors().length);

  private readonly patientsSignal = signal<Patient[]>([]);
  readonly patients = this.patientsSignal.asReadonly();

  private readonly doctorsSignal = signal<Doctor[]>([]);
  readonly doctors = this.doctorsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private healthMonitoringApi: HealthMonitoringApi) {
    this.loadDoctors();
    this.loadPatients();
  }

  /**
   * Retrieves a doctor by its ID as a signal.
   * @param id - The ID of the doctor.
   * @returns A Signal containing the Doctor object or undefined if not found.
   */
  getDoctorById(id: number): Signal<Doctor | undefined> {
    return computed(() => id ? this.doctors().find(d => d.id === id) : undefined);
  }

  /**
   * Retrieves a patient by its ID as a signal.
   * @param id - The ID of the patient.
   * @returns A Signal containing the Patient object or undefined if not found.
   */
  getPatientById(id: number): Signal<Patient | undefined> {
    return computed(() => id ? this.patients().find(p => p.id === id) : undefined);
  }

  /**
   * Adds a new patient.
   * @param patient - The patient to add.
   */
  addPatient(patient: Patient): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.healthMonitoringApi.createPatient(patient).pipe(retry(2)).subscribe({
      next: createdPatient => {
        createdPatient = this.assignDoctorToPatient(createdPatient);
        this.patientsSignal.update(patients => [...patients, createdPatient]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create patient'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing patient.
   * @param updatedPatient - The patient to update.
   */
  updatePatient(updatedPatient: Patient): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.healthMonitoringApi.updatePatient(updatedPatient).pipe(retry(2)).subscribe({
      next: patient => {
        patient = this.assignDoctorToPatient(patient);
        this.patientsSignal.update(patients =>
          patients.map(p => p.id === patient.id ? patient : p)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update patient'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a patient by ID.
   * @param id - The ID of the patient to delete.
   */
  deletePatient(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.healthMonitoringApi.deletePatient(id).pipe(retry(2)).subscribe({
      next: () => {
        this.patientsSignal.update(patients => patients.filter(p => p.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete patient'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Adds a new doctor.
   * @param doctor - The doctor to add.
   */
  addDoctor(doctor: Doctor): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.healthMonitoringApi.createDoctor(doctor).pipe(retry(2)).subscribe({
      next: createdDoctor => {
        this.doctorsSignal.update(doctors => [...doctors, createdDoctor]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create doctor'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing doctor.
   * @param updatedDoctor - The doctor to update.
   */
  updateDoctor(updatedDoctor: Doctor): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.healthMonitoringApi.updateDoctor(updatedDoctor).pipe(retry(2)).subscribe({
      next: doctor => {
        this.doctorsSignal.update(doctors =>
          doctors.map(d => d.id === doctor.id ? doctor : d)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update doctor'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a doctor by ID.
   * @param id - The ID of the doctor to delete.
   */
  deleteDoctor(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.healthMonitoringApi.deleteDoctor(id).pipe(retry(2)).subscribe({
      next: () => {
        this.doctorsSignal.update(doctors => doctors.filter(d => d.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete doctor'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads all patients from the API.
   */
  private loadPatients(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.healthMonitoringApi.getPatients().pipe(takeUntilDestroyed()).subscribe({
      next: patients => {
        this.patientsSignal.set(patients);
        this.loadingSignal.set(false);
        this.assignDoctorsToPatients();
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load patients'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads all doctors from the API.
   */
  private loadDoctors(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.healthMonitoringApi.getDoctors().pipe(takeUntilDestroyed()).subscribe({
      next: doctors => {
        this.doctorsSignal.set(doctors);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load doctors'));
        this.loadingSignal.set(false);
      }
    });
  }

  private assignDoctorsToPatients(): void {
    this.patientsSignal.update(patients => patients.map(patient => this.assignDoctorToPatient(patient)));
  }

  private assignDoctorToPatient(patient: Patient): Patient {
    const doctorId = patient.assignedDoctorId ?? 0;
    patient.doctor = doctorId ? this.getDoctorById(doctorId)() ?? null : null;
    return patient;
  }

  /**
   * Formats error messages for user-friendly display.
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns A formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
