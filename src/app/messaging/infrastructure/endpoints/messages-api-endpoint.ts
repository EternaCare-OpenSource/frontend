import {BaseApiEndpoint} from '../../../shared/infrastructure/endpoints/base-api-endpoint';
import {Message} from '../../domain/model/message.entity';
import {MessageResource, MessagesResponse} from '../response/message-response';
import {MessageAssembler} from '../assemblers/message-assembler';
import {HttpClient} from '@angular/common/http';
import {environmentProduction} from '../../../../environments/environment';



/**
 * API endpoint for managing messages.
 */
export class MessagesApiEndpoint extends BaseApiEndpoint<Message, MessageResource, MessagesResponse, MessageAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environmentProduction.carelinkProviderApiBaseUrl}${environmentProduction.carelinkProviderMessagesEndpointPath}`, new MessageAssembler());
  }
}
