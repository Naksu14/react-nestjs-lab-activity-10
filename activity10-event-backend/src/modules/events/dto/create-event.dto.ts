import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Conference 2024' })
  @IsString()
  @IsNotEmpty()
  title_event: string;

  @ApiProperty({ example: 'A conference about latest tech trends' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Convention Center, New York' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: '2024-06-15T09:00:00Z' })
  @IsDateString()
  start_datetime: string;

  @ApiProperty({ example: '2024-06-15T17:00:00Z' })
  @IsDateString()
  end_datetime: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({ enum: EventStatus })
  @IsEnum(EventStatus)
  status: EventStatus;

  @ApiProperty({ example: 1 })
  @IsNumber()
  organizer_id: number;
}
