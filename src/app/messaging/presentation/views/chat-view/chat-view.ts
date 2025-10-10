import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

/**
 * ChatView Component
 * @description A placeholder component for individual chat view. Users are encouraged to use the conversations list for a full experience.
 */
@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  template: `
    <div class="chat-view-container">
      <div class="chat-header">
        <button mat-icon-button routerLink="/messaging/conversations">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2>Chat View</h2>
      </div>
      <p>Individual chat view - Use conversations list for full experience</p>
      <button mat-raised-button routerLink="/messaging/conversations" color="primary">
        Go to Conversations
      </button>
    </div>
  `,
  styles: [`
    .chat-view-container {
      padding: 24px;
      text-align: center;
    }
    .chat-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
  `]
})
export class ChatView {
}
