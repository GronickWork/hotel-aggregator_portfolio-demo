import { typeId } from 'src/Users/Interfaces/param-id';
import { MarkMessagesAsReadDto } from './dto/MarkMessagesAsReadDto';
import { GetUnreadDto } from './dto/GetUnreadDto';

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(data: GetUnreadDto): Promise<number>;
  closeRequest(supportRequest: typeId): Promise<void>;
}

/**
 * 1. Метод ISupportRequestEmployeeService.getUnreadCount должен возвращать количество сообщений, которые были отправлены пользователем и не отмечены прочитанными.
   2. Метод ISupportRequestEmployeeService.markMessagesAsRead должен выставлять текущую дату в поле readAt всем сообщениям, которые не были прочитаны и были
    отправлены пользователем.
   3. Метод ISupportRequestEmployeeService.closeRequest должен менять флаг isActive на false.
 */
