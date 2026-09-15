import { typeId } from '../../Users/Interfaces/param-id';
import { GetChatListParams } from './GetChatListParams';
import { SendMessageDto } from '../dto/SendMessageDto';
import { ReplyMessageManager } from './ReplyMessageManager';
import { ReplyMessageClient } from './ReplyMessageClient';
import { ReplySendMessages } from './ReplySendMessages';

export interface ISupportRequestService {
  findSupportRequests(
    params: GetChatListParams,
  ): Promise<ReplyMessageClient[] | ReplyMessageManager[] | undefined>;
  sendMessage(data: SendMessageDto): Promise<ReplySendMessages>;
  getMessages(supportRequest: typeId): Promise<ReplySendMessages[]>;
  subscribe(handler: (requestId: string, message: ReplySendMessages) => void): () => void;
}
