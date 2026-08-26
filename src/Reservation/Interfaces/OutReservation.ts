export interface outReservation {
  reserveId: string;
  startDate: string;
  endDate: string;
  hotelRoom: {
    description: string | undefined;
    images: string[] | undefined;
  };
  hotel: {
    title: string;
    description: string;
  };
}
