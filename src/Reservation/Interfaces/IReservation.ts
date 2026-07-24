import { typeId } from 'src/Users/Interfaces/param-id';
import { ReservationSearchOptions } from './ReservationSearchOptions';
import { ReservationDto } from './dto/ReservationDto';
import { outReservation } from './OutReservation';

export interface IReservation {
  addReservation(data: ReservationDto): Promise<outReservation | string>;
  removeReservation(id: typeId): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<outReservation[] | string>;
}
