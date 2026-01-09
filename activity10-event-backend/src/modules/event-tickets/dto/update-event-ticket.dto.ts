import { PartialType } from '@nestjs/mapped-types';
import { CreateEventTicketDto } from './create-event-ticket.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateEventTicketDto extends PartialType(CreateEventTicketDto) {
    @ApiPropertyOptional({ example: '2024-06-15T12:00:00Z' })
    used_at?: string;
}
