import { Test, TestingModule } from '@nestjs/testing';
import { HotelRoomService } from './hotel-room.service';
import { HotelRoomController } from './hotel-room.controller';

describe('HotelRoomService', () => {
  let service: HotelRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelRoomController],
      providers: [HotelRoomService],
    }).compile();

    service = module.get<HotelRoomService>(HotelRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
