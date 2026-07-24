import { typeId } from 'src/Users/Interfaces/param-id';

export interface ReservationSearchOptions {
  userId?: typeId;
  dateStart?: Date;
  dateEnd?: Date;
}
