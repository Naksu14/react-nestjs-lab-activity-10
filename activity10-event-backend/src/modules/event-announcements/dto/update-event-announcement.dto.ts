import { PartialType } from '@nestjs/mapped-types';
import { CreateEventAnnouncementDto } from './create-event-announcement.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventAnnouncementDto extends PartialType(CreateEventAnnouncementDto) {
    @ApiPropertyOptional({ example: 'Event postponed' })
    title?: string;

    @ApiPropertyOptional({ example: 'The event has been postponed to next month...' })
    message?: string;
}
