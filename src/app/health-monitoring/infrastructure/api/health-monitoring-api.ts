import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {PatientsApiEndpoint} from '../endpoints/patients-api-endpoint';
import {DoctorsApiEndpoint} from '../endpoints/doctors-api-endpoint';
import {Patient} from '../../domain/model/patient.entity';
import {Doctor} from '../../domain/model/doctor.entity';
import {BaseApi} from '../../../shared/infrastructure/api/base-api';

/**
 * API service for managing endpoints in the health monitoring context (patients and doctors).
 */
@Injectable({providedIn: 'root'})
export class HealthMonitoringApi extends BaseApi {
  private readonly patientsEndpoint: PatientsApiEndpoint;
  private readonly doctorsEndpoint: DoctorsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.patientsEndpoint = new PatientsApiEndpoint(http);
    this.doctorsEndpoint = new DoctorsApiEndpoint(http);
  }

  /**
   * Retrieves all patients from the API.
   * @returns An Observable for an array of Patient objects.
   */
  getPatients(): Observable<Patient[]> {
    return this.patientsEndpoint.getAll();
  }

  /**
   * Retrieves a single patient by ID.
   * @param id - The ID of the patient.
   * @returns An Observable of the Patient object.
   */
  getPatient(id: number): Observable<Patient> {
    return this.patientsEndpoint.getById(id);
  }

  /**
   * Creates a new patient.
   * @param patient - The patient to create.
   * @returns An Observable of the created Patient object.
   */
  createPatient(patient: Patient): Observable<Patient> {
    return this.patientsEndpoint.create(patient);
  }

  /**
   * Updates an existing patient.
   * @param patient - The patient to update.
   * @returns An Observable of the updated Patient object.
   */
  updatePatient(patient: Patient): Observable<Patient> {
    return this.patientsEndpoint.update(patient, patient.id);
  }

  /**
   * Deletes a patient by ID.
   * @param id - The ID of the patient to delete.
   * @returns An Observable of void.
   */
  deletePatient(id: number): Observable<void> {
    return this.patientsEndpoint.delete(id);
  }

  /**
   * Retrieves all doctors from the API.
   * @returns An Observable for an array of Doctor objects.
   */
  getDoctors(): Observable<Doctor[]> {
    return this.doctorsEndpoint.getAll();
  }

  /**
   * Retrieves a single doctor by ID.
   * @param id - The ID of the doctor.
   * @returns An Observable of the Doctor object.
   */
  getDoctor(id: number): Observable<Doctor> {
    return this.doctorsEndpoint.getById(id);
  }

  /**
   * Creates a new doctor.
   * @param doctor - The doctor to create.
   * @returns An Observable of the created Doctor object.
   */
  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.doctorsEndpoint.create(doctor);
  }

  /**
   * Updates an existing doctor.
   * @param doctor - The doctor to update.
   * @returns An Observable of the updated Doctor object.
   */
  updateDoctor(doctor: Doctor): Observable<Doctor> {
    return this.doctorsEndpoint.update(doctor, doctor.id);
  }

  /**
   * Deletes a doctor by ID.
   * @param id - The ID of the doctor to delete.
   * @returns An Observable of void.
   */
  deleteDoctor(id: number): Observable<void> {
    return this.doctorsEndpoint.delete(id);
  }
}
