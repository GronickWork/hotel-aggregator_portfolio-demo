import { Injectable } from '@nestjs/common';
import { SupportRequestService } from './support-request.service';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

interface SubscribePayload {
  chatId: string;
}

@WebSocketGateway()
@Injectable()
export class SupportChatGatewey {
  private subscriptions = new Map<string, () => void>();
  constructor(private readonly SRService: SupportRequestService) {}

  @SubscribeMessage('SubscribeToChat')
  handleSubscribeToChat(data: SubscribePayload, @ConnectedSocket() client: Socket) {
    const chatId = data.chatId;
    const unsubscribe = this.SRService.subscribe((requestId, message) => {
      if (requestId === chatId) {
        client.emit('new-message', {
          id: message.id,
          createdAt: message.createdAt,
          text: message.text,
          readAt: message.readAt,
          author: {
            id: message.author.id,
            name: message.author.name,
          },
        });
      }
    });
    this.subscriptions.set(client.id, unsubscribe);
    return { success: true };
  }

  handleDisconnect(client: Socket) {
    const unsubscribe = this.subscriptions.get(client.id);
    if (unsubscribe) {
      unsubscribe();
      this.subscriptions.delete(client.id);
    }
  }
}
