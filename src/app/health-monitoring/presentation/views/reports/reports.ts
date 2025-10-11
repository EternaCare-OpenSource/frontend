import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 *
 * Structured metadata describing a downloadable medical report.
 */
interface MedicalReport {
  id: number;
  title: string;
  fileName: string;
  date: string;
  type: string;
  size: string;
}

/**
 *
 * Descriptor for a recommended medical test with frequency and illustration.
 */
interface MedicalTest {
  title: string;
  description: string;
  frequency: string;
  image: string;
}

/**
 *
 * Reports module: lists patient reports and recommended tests (weekly/monthly).
 * Uses Signals to expose immutable, reactive read models to the template.
 */
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTabsModule
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class Reports {
  /**
   *
   * IAM store dependency to access the current authenticated user.
   */
  private iamStore = inject(IamStore);

  /**
   *
   * Reactive reference to the current user.
   */
  readonly currentUser = this.iamStore.currentUser;

  /**
   *
   * Patient report entries available for download or preview.
   */
  readonly patientReports = signal<MedicalReport[]>([
    {
      id: 1,
      title: 'Blood Pressure Test Report',
      fileName: 'Blood_Pressure_Test_Report_23052025.pdf',
      date: '23/05/2025',
      type: 'Blood Test',
      size: '2.4 MB'
    },
    {
      id: 2,
      title: 'General Check Diagnosis',
      fileName: 'General_Check_Diagnosis_20052025.pdf',
      date: '20/05/2025',
      type: 'General Check',
      size: '1.8 MB'
    },
    {
      id: 3,
      title: 'Psychological Test Results',
      fileName: 'Psychological_Test_Results_20052025.pdf',
      date: '20/05/2025',
      type: 'Psychological',
      size: '3.2 MB'
    }
  ]);

  /**
   *
   * Recommended examinations performed on a weekly cadence.
   */
  readonly weeklyTests = signal<MedicalTest[]>([
    {
      title: 'BLOOD TEST',
      description: 'Blood tests analyze blood samples to check your health by measuring cells, proteins, and chemicals in your blood.',
      frequency: 'Weekly',
      image: 'https://i.postimg.cc/nrcHNLGg/blood-test.jpg'
    },
    {
      title: 'PHYSICAL TEST',
      description: 'Fitness assessments for seniors measure essential abilities like walking speed, balance, strength, and flexibility to evaluate health and mobility. These tests help identify frailty and fall risk.',
      frequency: 'Weekly',
      image: 'https://i.postimg.cc/KjqZby0s/physical-test.jpg'
    }
  ]);

  /**
   *
   * Recommended examinations performed on a monthly cadence.
   */
  readonly monthlyTests = signal<MedicalTest[]>([
    {
      title: 'OCULIST',
      description: 'Vision assessments for older adults evaluate visual acuity, depth perception, peripheral vision, and contrast sensitivity to determine eye health and functional sight capabilities.',
      frequency: 'Monthly',
      image: 'https://i.postimg.cc/7hsx4yKK/oculist-test.jpg'
    },
    {
      title: 'DENTIST',
      description: 'Dental examinations for older adults assess oral health through teeth inspection, gum evaluation, and bite analysis to identify decay, periodontal disease, and oral function issues. These checkups help detect age-related dental problems, evaluate chewing ability.',
      frequency: 'Monthly',
      image: 'https://i.postimg.cc/4yLJGTWB/dentist-test.jpg'
    }
  ]);

  /**
   *
   * Initiates the download of a report (placeholder for real download logic).
   * @param report Report to download.
   */
  downloadReport(report: MedicalReport): void {
    console.log('Downloading report:', report.fileName);
  }

  /**
   *
   * Opens a report preview (placeholder for real viewer integration).
   * @param report Report to preview.
   */
  viewReport(report: MedicalReport): void {
    console.log('Viewing report:', report.fileName);
  }

  /**
   *
   * Maps report type to a Material icon name for visual identification.
   * @param type Report category label.
   * @returns Icon name string.
   */
  getReportIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'Blood Test': 'bloodtype',
      'General Check': 'medical_services',
      'Psychological': 'psychology',
      'Physical': 'fitness_center'
    };
    return icons[type] || 'description';
  }

  /**
   *
   * Maps report type to a representative color used in chips/badges.
   * @param type Report category label.
   * @returns Hex color string.
   */
  getReportColor(type: string): string {
    const colors: { [key: string]: string } = {
      'Blood Test': '#f44336',
      'General Check': '#4caf50',
      'Psychological': '#9c27b0',
      'Physical': '#ff9800'
    };
    return colors[type] || '#666';
  }
}
