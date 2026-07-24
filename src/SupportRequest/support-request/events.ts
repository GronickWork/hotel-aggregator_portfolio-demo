import { EventEmitter2 } from '@nestjs/event-emitter';

export class SupportMessageEvent {
  constructor(
    public readonly requestId: string,
    public readonly message: any,
  ) {}
}

export const eventEmitter = new EventEmitter2();
