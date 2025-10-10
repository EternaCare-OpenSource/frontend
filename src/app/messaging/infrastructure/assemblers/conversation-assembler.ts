import {BaseAssembler} from '../../../shared/infrastructure/assemblers/base-assembler';
import {Conversation} from '../../domain/model/conversation.entity';
import {ConversationResource, ConversationsResponse} from '../response/conversation-response';


/**
 * Assembler for converting between Conversation entities, ConversationResource resources, and ConversationsResponse.
 */
export class ConversationAssembler implements BaseAssembler<Conversation, ConversationResource, ConversationsResponse> {

  toEntitiesFromResponse(response: ConversationsResponse): Conversation[] {
    return response.conversations.map(resource => this.toEntityFromResource(resource as ConversationResource));
  }

  toEntityFromResource(resource: ConversationResource): Conversation {
    return new Conversation({
      id: resource.id,
      participantIds: resource.participantIds,
      participantNames: resource.participantNames,
      lastMessageContent: resource.lastMessageContent,
      lastMessageTime: resource.lastMessageTime,
      unreadCount: resource.unreadCount,
      createdAt: resource.createdAt
    });
  }

  toResourceFromEntity(entity: Conversation): ConversationResource {
    return {
      id: entity.id,
      participantIds: entity.participantIds,
      participantNames: entity.participantNames,
      lastMessageContent: entity.lastMessageContent,
      lastMessageTime: entity.lastMessageTime,
      unreadCount: entity.unreadCount,
      createdAt: entity.createdAt
    } as ConversationResource;
  }
}
