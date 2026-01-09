import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RegistrationStatus } from '../entities/event-registration.entity';

export class CreateEventRegistrationDto {

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  event_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiPropertyOptional({
    enum: RegistrationStatus,
    default: RegistrationStatus.REGISTERED,
  })
  @IsEnum(RegistrationStatus)
  @IsOptional()
  registration_status?: RegistrationStatus;
}
