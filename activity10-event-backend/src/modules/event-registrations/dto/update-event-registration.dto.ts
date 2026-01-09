import { PartialType } from '@nestjs/mapped-types';
import { CreateEventRegistrationDto } from './create-event-registration.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RegistrationStatus } from '../entities/event-registration.entity';

export class UpdateEventRegistrationDto extends PartialType(
  CreateEventRegistrationDto,
) {
  @ApiPropertyOptional({ enum: RegistrationStatus })
  registration_status?: RegistrationStatus;
}
