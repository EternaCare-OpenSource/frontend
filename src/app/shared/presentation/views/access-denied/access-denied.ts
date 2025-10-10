import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="error-container">
      <div class="error-content">
        <mat-icon class="error-icon">block</mat-icon>
        <h1 class="error-title">Access Denied</h1>
        <p class="error-message">
          You don't have permission to access this page.
        </p>
        <p class="error-description">
          Please contact your administrator if you believe this is an error.
        </p>
        <div class="error-actions">
          <button mat-raised-button color="primary" routerLink="/home">
            <mat-icon>home</mat-icon>
            Go to Home
          </button>
          <button mat-stroked-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Go Back
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .error-content {
      text-align: center;
      max-width: 500px;
      background: white;
      padding: 48px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .error-icon {
      font-size: 120px;
      width: 120px;
      height: 120px;
      color: #f44336;
      margin-bottom: 24px;
    }

    .error-title {
      font-size: 32px;
      font-weight: 700;
      color: #333;
      margin: 0 0 16px 0;
    }

    .error-message {
      font-size: 18px;
      color: #666;
      margin: 0 0 12px 0;
    }

    .error-description {
      font-size: 14px;
      color: #999;
      margin: 0 0 32px 0;
    }

    .error-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    @media (max-width: 600px) {
      .error-content {
        padding: 32px;
      }

      .error-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
      }

      .error-title {
        font-size: 24px;
      }

      .error-actions {
        flex-direction: column;
      }

      .error-actions button {
        width: 100%;
      }
    }
  `]
})
export class AccessDenied {
  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }
}
