import { IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ScanStatus } from '../entities/event-checkin.entity';

export class CreateEventCheckinDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  ticket_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  event_id: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  scanned_by: number;

  @ApiPropertyOptional({ enum: ScanStatus })
  @IsEnum(ScanStatus)
  @IsOptional()
  scan_status?: ScanStatus;

  @ApiPropertyOptional({ example: '2024-06-15T09:10:00Z' })
  @IsDateString()
  @IsOptional()
  scan_time?: string;
}
