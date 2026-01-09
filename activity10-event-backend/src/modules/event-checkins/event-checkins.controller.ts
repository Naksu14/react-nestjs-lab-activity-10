import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventCheckinsService } from './event-checkins.service';
import { CreateEventCheckinDto } from './dto/create-event-checkin.dto';
import { UpdateEventCheckinDto } from './dto/update-event-checkin.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('event-checkins')
@Controller('event-checkins')
export class EventCheckinsController {
  constructor(private readonly eventCheckinsService: EventCheckinsService) {}

  // Create a new event check-in
  @Post()
  @ApiOperation({ summary: 'Create a new event check-in' })
  @ApiResponse({ status: 201, description: 'The event check-in has been successfully created.' })
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

  // Get a specific event check-in by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific event check-in by ID' })
  @ApiResponse({ status: 200, description: 'The event check-in details.' })
  findOne(@Param('id') id: string) {
    return this.eventCheckinsService.findOne(+id);
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
