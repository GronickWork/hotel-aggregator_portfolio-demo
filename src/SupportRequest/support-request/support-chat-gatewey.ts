import { Injectable } from '@nestjs/common';
import { SupportRequestService } from './support-request.service';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface SubscribePayload {
  chatId: string;
}

@WebSocketGateway({ path: '/support-chat' })
@Injectable()
export class SupportChatGatewey {
  private subscriptions = new Map<string, () => void>();
  constructor(private readonly SRService: SupportRequestService) {}

  @WebSocketServer() server!: Server;

  // Эти два метода NestJS ловит автоматически — имена менять нельзя
  handleConnection(client: Socket) {
    console.log('[WS] Client connected:', client.id);
  }

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
    console.log('[WS] Client disconnected:', client.id);
    const unsubscribe = this.subscriptions.get(client.id);
    if (unsubscribe) {
      unsubscribe();
      this.subscriptions.delete(client.id);
    }
  }

  @SubscribeMessage('send-message')
  handleSendMessage(client: Socket, payload: { text: string }) {
    const { text } = payload;
    console.log('[WS] Received message from', client.id, ':', text);

    // Пока просто логируем. Позже можно сохранять в БД и рассылать через SRService
    this.server.emit('new-message-test', {
      clientId: client.id,
      text,
      time: new Date().toISOString(),
    });
  }
}
