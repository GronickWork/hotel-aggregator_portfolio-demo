import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from '../Schemas/hotel.schema';
import { UsersModule } from 'src/Users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Hotel.name,
        schema: HotelSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [HotelController],
  providers: [HotelService],
  exports: [MongooseModule, HotelService],
})
export class HotelModule {}
