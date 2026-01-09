import {
  IsNumber,
  IsUUID,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketStatus } from '../entities/event-ticket.entity';

export class CreateEventTicketDto {
  @ApiPropertyOptional({
    description: 'If you want to set a specific ticket code',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsOptional()
  ticket_code?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  event_id: number;

  @ApiProperty({ example: 1 })
  @IsUUID()
  registration_id: string;

  @ApiPropertyOptional({ enum: TicketStatus, default: TicketStatus.VALID })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @ApiPropertyOptional({ example: '2024-06-15T09:00:00Z' })
  @IsDateString()
  @IsOptional()
  issued_at?: string;

  @ApiPropertyOptional({ example: '2024-06-16T09:00:00Z' })
  @IsDateString()
  @IsOptional()
  expiration_at?: string;

  @ApiPropertyOptional({ example: '2024-06-15T12:00:00Z' })
  @IsDateString()
  @IsOptional()
  used_at?: string;
}
