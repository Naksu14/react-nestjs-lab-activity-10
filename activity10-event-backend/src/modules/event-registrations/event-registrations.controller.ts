import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventRegistrationsService } from './event-registrations.service';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('event-registrations')
@Controller('event-registrations')
export class EventRegistrationsController {
  constructor(private readonly eventRegistrationsService: EventRegistrationsService) {}

  // Get event registrations by event ID
  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get event registrations by event ID' })
  @ApiResponse({ status: 200, description: 'List of event registrations for the specified event', type: [CreateEventRegistrationDto] })
  findByEventId(@Param('eventId') eventId: number) {
    return this.eventRegistrationsService.findByEventId(eventId);
  }

  // Get registrations for events owned by an organizer
  @Get('organizer/:organizerId')
  @ApiOperation({ summary: 'Get registrations across all events by organizer ID' })
  @ApiResponse({ status: 200, description: 'List of registrations for organizer events', type: [CreateEventRegistrationDto] })
  findByOrganizerId(@Param('organizerId') organizerId: number) {
    return this.eventRegistrationsService.findByOrganizerId(organizerId);
  }

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
