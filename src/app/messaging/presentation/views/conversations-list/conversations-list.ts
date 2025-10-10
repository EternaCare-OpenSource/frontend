import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import {MessagingStore} from '../../../application/messaging.store';
import {IamStore} from '../../../../iam/application/iam.store';
import {Conversation} from '../../../domain/model/conversation.entity';
import {Message} from '../../../domain/model/message.entity';

/**
 * ConversationsList Component
 * @description This component displays a list of conversations and allows users to select and view messages.
 * It also provides functionality to send new messages and mark messages as read.
 */
@Component({
  selector: 'app-conversations-list',
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
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: './conversations-list.html',
  styleUrls: ['./conversations-list.css']
})
export class ConversationsList {
  private messagingStore = inject(MessagingStore);
  private iamStore = inject(IamStore);

  readonly conversations = this.messagingStore.conversations;
  readonly currentUser = this.iamStore.currentUser;

  readonly selectedConversationId = signal<number | null>(null);
  readonly newMessageText = signal('');
  readonly searchQuery = signal('');

  readonly selectedConversation = computed(() => {
    const id = this.selectedConversationId();
    if (!id) return null;
    return this.messagingStore.getConversationById(id)();
  });

  readonly conversationMessages = computed(() => {
    const id = this.selectedConversationId();
    if (!id) return [];
    return this.messagingStore.getMessagesByConversation(id)() || [];
  });

  readonly filteredConversations = computed(() => {
    const allConversations = this.conversations() || [];
    const query = this.searchQuery().toLowerCase();

    if (!query) return allConversations;

    return allConversations.filter(conv =>
      conv.participantNames?.some(name => name.toLowerCase().includes(query)) ||
      conv.lastMessageContent?.toLowerCase().includes(query)
    );
  });

  constructor() {
    effect(() => {
      const convs = this.conversations() || [];
      if (convs.length > 0 && !this.selectedConversationId()) {
        this.selectedConversationId.set(convs[0].id);
      }
    });
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversationId.set(conversation.id);
    this.markMessagesAsRead(conversation.id);
  }

  /**
   * Sends a new message to the selected conversation.
   * @description This method checks if the user has selected a conversation and if the message text is not empty.
   * If both conditions are met, it creates a new Message object with the current user's details and the selected conversation ID.
   * The message is then added to the store and the new message text is cleared.
   * @throws An error if the user is not logged in or if the selected conversation ID is not available.'
   */
  sendMessage(): void {
    const text = this.newMessageText().trim();
    const conversationId = this.selectedConversationId();
    const user = this.currentUser();

    if (!text || !conversationId || !user) return;

    const newMessage = new Message({
      id: Date.now(),
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      receiverId: 0,
      receiverName: '',
      subject: '',
      content: text,
      sentAt: new Date().toISOString(),
      isRead: false,
      conversationId: conversationId
    });

    this.messagingStore.addMessage(newMessage);
    this.newMessageText.set('');
  }

  markMessagesAsRead(conversationId: number): void {
    const messages = this.messagingStore.getMessagesByConversation(conversationId)() || [];
    messages.filter(m => !m.isRead).forEach(m => {
      this.messagingStore.markAsRead(m.id);
    });
  }

  getAvatarInitials(name: string): string {
    if (!name) return '??';
    const names = name.split(' ');
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  }

  getAvatarColor(index: number): string {
    const colors = ['#5eb9d7', '#4caf50', '#ff9800', '#e91e63', '#9c27b0', '#2196f3'];
    return colors[index % colors.length];
  }

  formatTime(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  isMyMessage(message: Message): boolean {
    const user = this.currentUser();
    return user ? message.senderId === user.id : false;
  }
}
