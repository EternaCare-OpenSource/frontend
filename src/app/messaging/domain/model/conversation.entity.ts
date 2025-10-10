import {BaseEntity} from '../../../shared/infrastructure/entities/base-entity';


/**
 * Represents a Conversation entity in the application.
 * @remarks
 * This class is used as a domain model for conversations in the messaging context.
 * It implements the BaseEntity interface to ensure consistency across entities.
 * @see {@link BaseEntity}
 */
export class Conversation implements BaseEntity {
  /**
   * Creates a new Conversation instance.
   * @param conversation - An object containing the conversation's information.
   * @returns A new instance of Conversation.
   */
  constructor(conversation: {
    id: number;
    participantIds: number[];
    participantNames: string[];
    lastMessageContent: string;
    lastMessageTime: string;
    unreadCount: number;
    createdAt: string;
  }) {
    this._id = conversation.id;
    this._participantIds = conversation.participantIds;
    this._participantNames = conversation.participantNames;
    this._lastMessageContent = conversation.lastMessageContent;
    this._lastMessageTime = conversation.lastMessageTime;
    this._unreadCount = conversation.unreadCount;
    this._createdAt = conversation.createdAt;
  }

  private _id: number;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  private _participantIds: number[];

  get participantIds(): number[] {
    return this._participantIds;
  }

  set participantIds(value: number[]) {
    this._participantIds = value;
  }

  private _participantNames: string[];

  get participantNames(): string[] {
    return this._participantNames;
  }

  set participantNames(value: string[]) {
    this._participantNames = value;
  }

  private _lastMessageContent: string;

  get lastMessageContent(): string {
    return this._lastMessageContent;
  }

  set lastMessageContent(value: string) {
    this._lastMessageContent = value;
  }

  private _lastMessageTime: string;

  get lastMessageTime(): string {
    return this._lastMessageTime;
  }

  set lastMessageTime(value: string) {
    this._lastMessageTime = value;
  }

  private _unreadCount: number;

  get unreadCount(): number {
    return this._unreadCount;
  }

  set unreadCount(value: number) {
    this._unreadCount = value;
  }

  private _createdAt: string;

  get createdAt(): string {
    return this._createdAt;
  }

  set createdAt(value: string) {
    this._createdAt = value;
  }

  /**
   * Gets the display name for the conversation (participant names joined).
   * @returns The formatted participant names.
   */
  get displayName(): string {
    return this._participantNames.join(', ');
  }
}
