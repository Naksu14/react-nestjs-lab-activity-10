import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventStatus } from '../entities/event.entity';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiPropertyOptional({ example: 'Tech Conference 2024' })
  title_event?: string;
  @ApiPropertyOptional({ example: 'A conference about latest tech trends' })
  description?: string;
  @ApiPropertyOptional({ example: 'Convention Center, New York' })
  location?: string;
  @ApiPropertyOptional({ example: '2024-06-15T09:00:00Z' })
  start_datetime?: string;
  @ApiPropertyOptional({ example: '2024-06-15T17:00:00Z' })
  end_datetime?: string;
  @ApiPropertyOptional({ example: 500 })
  capacity?: number;
  @ApiPropertyOptional({ enum: EventStatus })
  status?: EventStatus;
}
