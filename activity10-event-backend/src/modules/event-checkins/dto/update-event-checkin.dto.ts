import { PartialType } from '@nestjs/mapped-types';
import { CreateEventCheckinDto } from './create-event-checkin.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ScanStatus } from '../entities/event-checkin.entity';

export class UpdateEventCheckinDto extends PartialType(CreateEventCheckinDto) {
    @ApiPropertyOptional({ example: 1 })
    ticket_id?: number;

    @ApiPropertyOptional({ example: 1 })
    event_id?: number;

    @ApiPropertyOptional({ example: 2 })
    scanned_by?: number;

    @ApiPropertyOptional({ example: '2024-06-15T09:10:00Z' })
    scan_time?: string;

    @ApiPropertyOptional({ enum: ScanStatus })
    scan_status?: ScanStatus;
    
}
