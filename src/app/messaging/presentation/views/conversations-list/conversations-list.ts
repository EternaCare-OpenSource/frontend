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
import { MessagingStore } from '../../../application/messaging.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { Conversation } from '../../../domain/model/conversation.entity';
import { Message } from '../../../domain/model/message.entity';

/**
 *
 * Conversations list and chat view. Lets users browse conversations, read messages,
 * send new messages, and auto-mark unread as read when a conversation is opened.
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
  /**
   *
   * Store dependencies for messaging data and current user context.
   */
  private messagingStore = inject(MessagingStore);
  private iamStore = inject(IamStore);

  /**
   *
   * Reactive source of conversations from the store.
   */
  readonly conversations = this.messagingStore.conversations;

  /**
   *
   * Reactive reference to the authenticated user.
   */
  readonly currentUser = this.iamStore.currentUser;

  /**
   *
   * Currently selected conversation id; null means none selected.
   */
  readonly selectedConversationId = signal<number | null>(null);

  /**
   *
   * Draft text for a new outgoing message.
   */
  readonly newMessageText = signal('');

  /**
   *
   * Search query used to filter the conversation list.
   */
  readonly searchQuery = signal('');

  /**
   *
   * Selected conversation entity resolved from the store.
   */
  readonly selectedConversation = computed(() => {
    const id = this.selectedConversationId();
    if (!id) return null;
    return this.messagingStore.getConversationById(id)();
  });

  /**
   *
   * Messages for the selected conversation, or empty array when none selected.
   */
  readonly conversationMessages = computed(() => {
    const id = this.selectedConversationId();
    if (!id) return [];
    return this.messagingStore.getMessagesByConversation(id)() || [];
  });

  /**
   *
   * Conversations filtered by participant names or last message content.
   */
  readonly filteredConversations = computed(() => {
    const allConversations = this.conversations() || [];
    const query = this.searchQuery().toLowerCase();

    if (!query) return allConversations;

    return allConversations.filter(conv =>
      conv.participantNames?.some(name => name.toLowerCase().includes(query)) ||
      conv.lastMessageContent?.toLowerCase().includes(query)
    );
  });

  /**
   *
   * Constructor side-effect: auto-select first conversation when list loads and none selected.
   */
  constructor() {
    effect(() => {
      const convs = this.conversations() || [];
      if (convs.length > 0 && !this.selectedConversationId()) {
        this.selectedConversationId.set(convs[0].id);
      }
    });
  }

  /**
   *
   * Selects a conversation and marks its unread messages as read.
   * @param conversation Conversation to open.
   */
  selectConversation(conversation: Conversation): void {
    this.selectedConversationId.set(conversation.id);
    this.markMessagesAsRead(conversation.id);
  }

  /**
   *
   * Sends a new text message in the selected conversation (no-op if invalid state).
   * Creates a Message entity and persists it via MessagingStore.
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

  /**
   *
   * Marks all unread messages in a conversation as read.
   * @param conversationId Conversation identifier.
   */
  markMessagesAsRead(conversationId: number): void {
    const messages = this.messagingStore.getMessagesByConversation(conversationId)() || [];
    messages.filter(m => !m.isRead).forEach(m => {
      this.messagingStore.markAsRead(m.id);
    });
  }

  /**
   *
   * Derives two-letter initials from a participant name for avatars.
   * @param name Full name string.
   * @returns Uppercase initials or '??' when name is empty.
   */
  getAvatarInitials(name: string): string {
    if (!name) return '??';
    const names = name.split(' ');
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  }

  /**
   *
   * Cycles through a palette to assign consistent avatar colors.
   * @param index Index of the participant.
   * @returns Hex color string.
   */
  getAvatarColor(index: number): string {
    const colors = ['#5eb9d7', '#4caf50', '#ff9800', '#e91e63', '#9c27b0', '#2196f3'];
    return colors[index % colors.length];
  }

  /**
   *
   * Formats an ISO timestamp into a relative time (e.g., '5m ago').
   * Falls back to locale date when older than a week.
   * @param dateString ISO date-time string.
   * @returns Human-friendly time label.
   */
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

  /**
   *
   * Indicates whether a message was sent by the current user.
   * @param message Message to test.
   * @returns True if the senderId matches the current user id.
   */
  isMyMessage(message: Message): boolean {
    const user = this.currentUser();
    return user ? message.senderId === user.id : false;
  }
}
