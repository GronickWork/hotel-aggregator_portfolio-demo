export interface outReservation {
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
