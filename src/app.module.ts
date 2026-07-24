import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Users/users.module';
import { HotelModule } from './Hotels/hotel/hotel.module';
import { HotelRoomModule } from './Hotels/hotelRoom/hotel-room.module';
import { ReservationModule } from './Reservation/reservation.module';
import { SupportRequestModule } from './SupportRequest/support-request/support-request.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { links } from 'project-config/links-config';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { SupportRequestClientModule } from './SupportRequest/support-request-client/support-request-client.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // загружает .env автоматически из корня
    MongooseModule.forRoot(links.UrlDb || 'mongodb://localhost:27017/ClusterDPH'),
    UsersModule,
    HotelModule,
    HotelRoomModule,
    ReservationModule,
    SupportRequestModule,
    AuthModule,
    SessionModule,
    SupportRequestClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
