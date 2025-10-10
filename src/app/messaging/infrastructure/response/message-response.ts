import {BaseResource, BaseResponse} from '../../../shared/infrastructure/response/base-response';


/**
 * Represents a single message resource returned from the API.
 */
export interface MessageResource extends BaseResource {
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
}

/**
 * Represents the response structure for a list of messages from the API.
 */
export interface MessagesResponse extends BaseResponse {
  messages: MessageResource[];
}
