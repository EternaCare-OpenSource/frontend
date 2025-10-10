import {computed, Injectable, Signal, signal} from '@angular/core';
import {Message} from '../domain/model/message.entity';
import {Conversation} from '../domain/model/conversation.entity';

import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {MessagingApi} from '../infrastructure/api/messaging-api';

/**
 * State management store for messages and conversations using Angular signals.
 */
@Injectable({
  providedIn: 'root'
})
export class MessagingStore {
  readonly messageCount = computed(() => this.messages()?.length || 0);
  readonly conversationCount = computed(() => this.conversations()?.length || 0);
  readonly unreadCount = computed(() => this.messages()?.filter(m => !m.isRead).length || 0);

  private readonly messagesSignal = signal<Message[]>([]);
  readonly messages = this.messagesSignal.asReadonly();

  private readonly conversationsSignal = signal<Conversation[]>([]);
  readonly conversations = this.conversationsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private messagingApi: MessagingApi) {
    this.loadConversations();
    this.loadMessages();
  }

  getConversationById(id: number): Signal<Conversation | undefined> {
    return computed(() => {
      const convs = this.conversations() || [];
      return id ? convs.find(c => c.id === id) : undefined;
    });
  }

  getMessageById(id: number): Signal<Message | undefined> {
    return computed(() => {
      const msgs = this.messages() || [];
      return id ? msgs.find(m => m.id === id) : undefined;
    });
  }

  getMessagesByConversation(conversationId: number): Signal<Message[]> {
    return computed(() => {
      const msgs = this.messages() || [];
      return msgs.filter(m => m.conversationId === conversationId);
    });
  }

  addMessage(message: Message): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.messagingApi.createMessage(message).pipe(retry(2)).subscribe({
      next: createdMessage => {
        this.messagesSignal.update(messages => [...messages, createdMessage]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to send message'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateMessage(updatedMessage: Message): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.messagingApi.updateMessage(updatedMessage).pipe(retry(2)).subscribe({
      next: message => {
        this.messagesSignal.update(messages =>
          messages.map(m => m.id === message.id ? message : m)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update message'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteMessage(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.messagingApi.deleteMessage(id).pipe(retry(2)).subscribe({
      next: () => {
        this.messagesSignal.update(messages => messages.filter(m => m.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete message'));
        this.loadingSignal.set(false);
      }
    });
  }

  markAsRead(messageId: number): void {
    const message = this.getMessageById(messageId)();
    if (message && !message.isRead) {
      message.isRead = true;
      this.updateMessage(message);
    }
  }

  addConversation(conversation: Conversation): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.messagingApi.createConversation(conversation).pipe(retry(2)).subscribe({
      next: createdConversation => {
        this.conversationsSignal.update(conversations => [...conversations, createdConversation]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create conversation'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateConversation(updatedConversation: Conversation): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.messagingApi.updateConversation(updatedConversation).pipe(retry(2)).subscribe({
      next: conversation => {
        this.conversationsSignal.update(conversations =>
          conversations.map(c => c.id === conversation.id ? conversation : c)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update conversation'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteConversation(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.messagingApi.deleteConversation(id).pipe(retry(2)).subscribe({
      next: () => {
        this.conversationsSignal.update(conversations => conversations.filter(c => c.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete conversation'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadMessages(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.messagingApi.getMessages().pipe(takeUntilDestroyed()).subscribe({
      next: messages => {
        const messagesArray = Array.isArray(messages) ? messages : [];
        this.messagesSignal.set(messagesArray);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load messages'));
        this.messagesSignal.set([]);
        this.loadingSignal.set(false);
      }
    });
  }

  private loadConversations(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.messagingApi.getConversations().pipe(takeUntilDestroyed()).subscribe({
      next: conversations => {
        const conversationsArray = Array.isArray(conversations) ? conversations : [];
        this.conversationsSignal.set(conversationsArray);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load conversations'));
        this.conversationsSignal.set([]);
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
