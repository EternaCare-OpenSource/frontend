import {BaseResource, BaseResponse} from '../../../shared/infrastructure/response/base-response';


/**
 * Represents the API resource/DTO for a conversation.
 */
export interface ConversationResource extends BaseResource {
  id: number;
  participantIds: number[];
  participantNames: string[];
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
  createdAt: string;
}

/**
 * Represents the API response structure for a list of conversations.
 */
export interface ConversationsResponse extends BaseResponse {
  conversations: ConversationResource[];
}
