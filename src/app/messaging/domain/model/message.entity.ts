/**
 * Represents a Message entity in the application.
 * @remarks
 * This class is used as a domain model for messages in the messaging context.
 *
 * @example
 * ```typescript
 * const message = new Message({
 *   id: 1,
 *   senderId: 1,
 *   senderName: 'Dr. Watson',
 *   receiverId: 2,
 *   receiverName: 'Juan Gonzales',
 *   subject: 'Appointment Confirmation',
 *   content: 'Your appointment is confirmed for tomorrow at 10:00 AM',
 *   sentAt: '2025-10-09T14:30:00',
 *   isRead: false,
 *   conversationId: 1
 * });
 * ```
 */
export class Message {
  private _id: number;
  private _senderId: number;
  private _senderName: string;
  private _receiverId: number;
  private _receiverName: string;
  private _subject: string;
  private _content: string;
  private _sentAt: string;
  private _isRead: boolean;
  private _conversationId: number;

  constructor(message: {
    id: number;
    senderId: number;
    senderName: string;
    receiverId: number;
    receiverName: string;
    subject: string;
    content: string;
    sentAt: string;
    isRead: boolean;
    conversationId: number;
  }) {
    this._id = message.id;
    this._senderId = message.senderId;
    this._senderName = message.senderName;
    this._receiverId = message.receiverId;
    this._receiverName = message.receiverName;
    this._subject = message.subject;
    this._content = message.content;
    this._sentAt = message.sentAt;
    this._isRead = message.isRead;
    this._conversationId = message.conversationId;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get senderId(): number {
    return this._senderId;
  }

  set senderId(value: number) {
    this._senderId = value;
  }

  get senderName(): string {
    return this._senderName;
  }

  set senderName(value: string) {
    this._senderName = value;
  }

  get receiverId(): number {
    return this._receiverId;
  }

  set receiverId(value: number) {
    this._receiverId = value;
  }

  get receiverName(): string {
    return this._receiverName;
  }

  set receiverName(value: string) {
    this._receiverName = value;
  }

  get subject(): string {
    return this._subject;
  }

  set subject(value: string) {
    this._subject = value;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }

  get sentAt(): string {
    return this._sentAt;
  }

  set sentAt(value: string) {
    this._sentAt = value;
  }

  get isRead(): boolean {
    return this._isRead;
  }

  set isRead(value: boolean) {
    this._isRead = value;
  }

  get conversationId(): number {
    return this._conversationId;
  }

  set conversationId(value: number) {
    this._conversationId = value;
  }

  /**
   * Gets formatted date/time for display.
   * @returns The formatted datetime string.
   */
  get formattedTime(): string {
    const date = new Date(this._sentAt);
    return date.toLocaleString();
  }
}
