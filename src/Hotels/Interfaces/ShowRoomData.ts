import { typeId } from 'src/Users/Interfaces/param-id';

export interface ShowRoomData {
  outRoom: string[] & HTMLCollectionOf<HTMLImageElement>;
  id: typeId;
  description: string;
  images: string[];
  isEnabled: boolean;
  hotel: {
    id: string;
    title: string;
    description?: string;
  };
}
