import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EventCheckinsService } from './event-checkins.service';
import { CreateEventCheckinDto } from './dto/create-event-checkin.dto';
import { UpdateEventCheckinDto } from './dto/update-event-checkin.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('event-checkins')
@Controller('event-checkins')
export class EventCheckinsController {
  constructor(private readonly eventCheckinsService: EventCheckinsService) {}

  // Create a new event check-in
  @Post()
  @ApiOperation({ summary: 'Create a new event check-in' })
  @ApiResponse({ status: 201, description: 'The event check-in has been successfully created.' })
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createEventCheckinDto: CreateEventCheckinDto) {
    return this.eventCheckinsService.create(createEventCheckinDto);
  }

  // Get all event check-ins
  @Get()
  @ApiOperation({ summary: 'Retrieve all event check-ins' })
  @ApiResponse({ status: 200, description: 'List of all event check-ins.' })
  findAll() {
    return this.eventCheckinsService.findAll();
  }

  // Get all event check-ins by scanned_by user ID
  @Get('scanned-by/:scanned_by')
  @ApiOperation({ summary: 'Retrieve all event check-ins by scanned_by user ID' })
  @ApiResponse({ status: 200, description: 'List of event check-ins scanned by the specified user.' })
  @UseGuards(AuthGuard('jwt'))
  findAllByScannedby(@Param('scanned_by') scanned_by: number) {
    return this.eventCheckinsService.findAllCheckinsByScannedby(scanned_by);
  }

  // get all check-ins by event ID
  @Get('event/:event_id')
  @ApiOperation({ summary: 'Retrieve all event check-ins by event ID' })
  @ApiResponse({ status: 200, description: 'List of event check-ins for the specified event.' })
  @UseGuards(AuthGuard('jwt'))
  findAllByEventId(@Param('event_id') event_id: number) {
    return this.eventCheckinsService.findAllCheckinsByEventId(event_id);
  }

  // Get all event check-ins by ticket ID
  @Get('ticket-id/:ticket_id')
  @ApiOperation({ summary: 'Retrieve all event check-ins by ticket ID' })
  @ApiResponse({ status: 200, description: 'List of event check-ins for the specified ticket.' })
  @UseGuards(AuthGuard('jwt'))
  findAllByTicketId(@Param('ticket_id') ticket_id: number) {
    return this.eventCheckinsService.findAllCheckinsByTicketId(ticket_id);
  }

  // Get a specific event check-in by ticket ID
  @Get(':ticket_id')
  @ApiOperation({ summary: 'Get a specific event check-in by ticket ID' })
  @ApiResponse({ status: 200, description: 'The event check-in details.' })
  @UseGuards(AuthGuard('jwt'))
  findOneByTicketId(@Param('ticket_id') ticket_id: number) {
    return this.eventCheckinsService.findOne(ticket_id);
  }

  // Update a specific event check-in by ID
  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific event check-in by ID' })
  @ApiResponse({ status: 200, description: 'The event check-in has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateEventCheckinDto: UpdateEventCheckinDto) {
    return this.eventCheckinsService.update(+id, updateEventCheckinDto);
  }

  // Delete a specific event check-in by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific event check-in by ID' })
  @ApiResponse({ status: 200, description: 'The event check-in has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.eventCheckinsService.remove(+id);
  }
}
