import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {BaseApi} from '../../../shared/infrastructure/api/base-api';
import {MessagesApiEndpoint} from '../endpoints/messages-api-endpoint';
import {ConversationsApiEndpoint} from '../endpoints/conversations-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Message} from '../../domain/model/message.entity';
import {Conversation} from '../../domain/model/conversation.entity';

/**
 * API service for managing endpoints in the messaging context.
 */
@Injectable({providedIn: 'root'})
export class MessagingApi extends BaseApi {
  private readonly messagesEndpoint: MessagesApiEndpoint;
  private readonly conversationsEndpoint: ConversationsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.messagesEndpoint = new MessagesApiEndpoint(http);
    this.conversationsEndpoint = new ConversationsApiEndpoint(http);
  }

  getMessages(): Observable<Message[]> {
    return this.messagesEndpoint.getAll();
  }

  getMessage(id: number): Observable<Message> {
    return this.messagesEndpoint.getById(id);
  }

  createMessage(message: Message): Observable<Message> {
    return this.messagesEndpoint.create(message);
  }

  updateMessage(message: Message): Observable<Message> {
    return this.messagesEndpoint.update(message, message.id);
  }

  deleteMessage(id: number): Observable<void> {
    return this.messagesEndpoint.delete(id);
  }

  getConversations(): Observable<Conversation[]> {
    return this.conversationsEndpoint.getAll();
  }

  getConversation(id: number): Observable<Conversation> {
    return this.conversationsEndpoint.getById(id);
  }

  createConversation(conversation: Conversation): Observable<Conversation> {
    return this.conversationsEndpoint.create(conversation);
  }

  updateConversation(conversation: Conversation): Observable<Conversation> {
    return this.conversationsEndpoint.update(conversation, conversation.id);
  }

  deleteConversation(id: number): Observable<void> {
    return this.conversationsEndpoint.delete(id);
  }
}
