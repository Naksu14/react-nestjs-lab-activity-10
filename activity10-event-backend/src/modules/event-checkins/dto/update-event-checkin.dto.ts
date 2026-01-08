import { PartialType } from '@nestjs/mapped-types';
import { CreateEventCheckinDto } from './create-event-checkin.dto';

export class UpdateEventCheckinDto extends PartialType(CreateEventCheckinDto) {}
