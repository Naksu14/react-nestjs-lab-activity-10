import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventAnnouncementDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  event_id: number;

  @ApiProperty({ example: 'Event cancelled' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Due to bad weather...' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  sent_by: number;
}
