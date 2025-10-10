import {BaseAssembler} from '../../../shared/infrastructure/assemblers/base-assembler';
import {Message} from '../../domain/model/message.entity';
import {MessageResource, MessagesResponse} from '../response/message-response';


/**
 * Assembler for converting between Message entities, MessageResource resources, and MessagesResponse.
 */
export class MessageAssembler implements BaseAssembler<Message, MessageResource, MessagesResponse> {

  toEntitiesFromResponse(response: MessagesResponse): Message[] {
    console.log(response);
    return response.messages.map(resource => this.toEntityFromResource(resource as MessageResource));
  }

  toEntityFromResource(resource: MessageResource): Message {
    return new Message({
      id: resource.id,
      senderId: resource.senderId,
      senderName: resource.senderName,
      receiverId: resource.receiverId,
      receiverName: resource.receiverName,
      subject: resource.subject,
      content: resource.content,
      sentAt: resource.sentAt,
      isRead: resource.isRead,
      conversationId: resource.conversationId
    });
  }

  toResourceFromEntity(entity: Message): MessageResource {
    return {
      id: entity.id,
      senderId: entity.senderId,
      senderName: entity.senderName,
      receiverId: entity.receiverId,
      receiverName: entity.receiverName,
      subject: entity.subject,
      content: entity.content,
      sentAt: entity.sentAt,
      isRead: entity.isRead,
      conversationId: entity.conversationId
    } as MessageResource;
  }
}
