import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-not-found',
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
        <div class="error-code">404</div>
        <mat-icon class="error-icon">search_off</mat-icon>
        <h1 class="error-title">Page Not Found</h1>
        <p class="error-message">
          The page you're looking for doesn't exist or has been moved.
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
      background: linear-gradient(135deg, #5eb9d7 0%, #4a9bb8 100%);
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

    .error-code {
      font-size: 96px;
      font-weight: 900;
      color: #5eb9d7;
      line-height: 1;
      margin-bottom: 16px;
    }

    .error-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #999;
      margin-bottom: 24px;
    }

    .error-title {
      font-size: 32px;
      font-weight: 700;
      color: #333;
      margin: 0 0 16px 0;
    }

    .error-message {
      font-size: 16px;
      color: #666;
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

      .error-code {
        font-size: 72px;
      }

      .error-icon {
        font-size: 60px;
        width: 60px;
        height: 60px;
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
export class PageNotFound {
  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }
}
