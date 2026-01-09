import { PartialType } from '@nestjs/mapped-types';
import { CreateEventUserDto } from './create-event-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventUserDto extends PartialType(CreateEventUserDto) {
    @ApiPropertyOptional({ example: 'Jane' })
    first_name?: string;
    @ApiPropertyOptional({ example: 'Doe' })
    last_name?: string;
    @ApiPropertyOptional({ example: 'jane.doe@example.com' })
    email?: string;
    @ApiPropertyOptional({ example: 'securePassword123' })
    password?: string;
    @ApiPropertyOptional({ example: 'user' })
    role?: string;
    @ApiPropertyOptional({ example: true })
    isActive?: boolean;
}
