import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventRegistrationsService } from './event-registrations.service';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('event-registrations')
@Controller('event-registrations')
export class EventRegistrationsController {
  constructor(private readonly eventRegistrationsService: EventRegistrationsService) {}

  // Create a new event registration
  @Post()
  @ApiOperation({ summary: 'Create a new event registration' })
  @ApiResponse({ status: 201, description: 'The created event registration', type: CreateEventRegistrationDto })
  create(@Body() createEventRegistrationDto: CreateEventRegistrationDto) {
    return this.eventRegistrationsService.create(createEventRegistrationDto);
  }

  // Get all event registrations
  @Get()
  @ApiOperation({ summary: 'Get all event registrations' })
  @ApiResponse({ status: 200, description: 'List of event registrations', type: [CreateEventRegistrationDto] })
  findAll() {
    return this.eventRegistrationsService.findAll();
  }

  // Get event registration by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get event registration by ID' })
  @ApiResponse({ status: 200, description: 'Event registration', type: CreateEventRegistrationDto })
  findOne(@Param('id') id: number) {
    return this.eventRegistrationsService.findOne(id);
  }

  // Update an event registration
  @Patch(':id')
  @ApiOperation({ summary: 'Update an event registration' })
  @ApiResponse({ status: 200, description: 'The updated event registration', type: CreateEventRegistrationDto })
  update(
    @Param('id') id: number,
    @Body() updateEventRegistrationDto: UpdateEventRegistrationDto,
  ) {
    return this.eventRegistrationsService.update(id, updateEventRegistrationDto);
  }
 
 // Delete an event registration
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event registration' })
  @ApiResponse({ status: 200, description: 'The deleted event registration' })
  remove(@Param('id') id: number) {
    return this.eventRegistrationsService.remove(id);
  }
}
