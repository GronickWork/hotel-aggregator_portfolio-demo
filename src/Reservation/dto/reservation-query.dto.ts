import { IsDateString, IsOptional } from 'class-validator';

export class ReservationQueryDto {
  @IsOptional()
  @IsDateString()
  dateStart?: Date;

  @IsOptional()
  @IsDateString()
  dateEnd?: Date;
}
