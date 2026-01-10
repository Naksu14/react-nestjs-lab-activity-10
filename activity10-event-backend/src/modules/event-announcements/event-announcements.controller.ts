import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventAnnouncementsService } from './event-announcements.service';
import { CreateEventAnnouncementDto } from './dto/create-event-announcement.dto';
import { UpdateEventAnnouncementDto } from './dto/update-event-announcement.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('event-announcements')
@Controller('event-announcements')
export class EventAnnouncementsController {
  constructor(
    private readonly eventAnnouncementsService: EventAnnouncementsService,
  ) {}

  // Create a new event announcement
  @Post()
  @ApiOperation({ summary: 'Create a new event announcement' })
  @ApiResponse({
    status: 201,
    description: 'The created event announcement',
    type: CreateEventAnnouncementDto,
  })
  create(@Body() createEventAnnouncementDto: CreateEventAnnouncementDto) {
    return this.eventAnnouncementsService.create(createEventAnnouncementDto);
  }

  // Get all event announcements
  @Get()
  @ApiOperation({ summary: 'Get all event announcements' })
  @ApiResponse({
    status: 200,
    description: 'List of event announcements',
    type: [CreateEventAnnouncementDto],
  })
  findAll() {
    return this.eventAnnouncementsService.findAll();
  }

  // Get all announcements for a specific event
  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get all announcements for a specific event' })
  @ApiResponse({
    status: 200,
    description: 'List of event announcements for the event',
    type: [CreateEventAnnouncementDto],
  })
  findByEvent(@Param('eventId') eventId: string) {
    return this.eventAnnouncementsService.findByEvent(+eventId);
  }

  // Get a specific event announcement by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific event announcement by ID' })
  @ApiResponse({
    status: 200,
    description: 'The event announcement',
    type: CreateEventAnnouncementDto,
  })
  findOne(@Param('id') id: string) {
    return this.eventAnnouncementsService.findOne(+id);
  }

  // Update an event announcement by ID
  @Patch(':id')
  @ApiOperation({ summary: 'Update an event announcement by ID' })
  @ApiResponse({
    status: 200,
    description: 'The updated event announcement',
    type: CreateEventAnnouncementDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateEventAnnouncementDto: UpdateEventAnnouncementDto,
  ) {
    return this.eventAnnouncementsService.update(
      +id,
      updateEventAnnouncementDto,
    );
  }

  // Delete an event announcement by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event announcement by ID' })
  @ApiResponse({
    status: 200,
    description: 'The deleted event announcement',
    type: CreateEventAnnouncementDto,
  })
  remove(@Param('id') id: string) {
    return this.eventAnnouncementsService.remove(+id);
  }
}
