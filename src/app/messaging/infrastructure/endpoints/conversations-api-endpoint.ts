import {BaseApiEndpoint} from '../../../shared/infrastructure/endpoints/base-api-endpoint';
import {Conversation} from '../../domain/model/conversation.entity';
import {ConversationResource, ConversationsResponse} from '../response/conversation-response';
import {ConversationAssembler} from '../assemblers/conversation-assembler';
import {HttpClient} from '@angular/common/http';
import {environmentProduction} from '../../../../environments/environment';


/**
 * API endpoint for managing conversations.
 */
export class ConversationsApiEndpoint extends BaseApiEndpoint<Conversation, ConversationResource, ConversationsResponse, ConversationAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environmentProduction.carelinkProviderApiBaseUrl}${environmentProduction.carelinkProviderConversationsEndpointPath}`, new ConversationAssembler());
  }
}
