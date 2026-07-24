export interface ReservationFilters {
  userId?: { $eq: string };
  dateStart?: { $eq: Date };
  dateEnd?: { $eq: Date };
}
