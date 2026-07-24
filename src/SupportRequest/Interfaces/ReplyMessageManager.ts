export interface ReplyMessageManager {
  id: string;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
  client: {
    id: string | undefined;
    name: string | undefined;
    email: string | undefined;
    contactPhone: string | undefined;
  };
}
