import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventCheckinsService } from './event-checkins.service';
import { CreateEventCheckinDto } from './dto/create-event-checkin.dto';
import { UpdateEventCheckinDto } from './dto/update-event-checkin.dto';

@Controller('event-checkins')
export class EventCheckinsController {
  constructor(private readonly eventCheckinsService: EventCheckinsService) {}

  @Post()
  create(@Body() createEventCheckinDto: CreateEventCheckinDto) {
    return this.eventCheckinsService.create(createEventCheckinDto);
  }

  @Get()
  findAll() {
    return this.eventCheckinsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventCheckinsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventCheckinDto: UpdateEventCheckinDto) {
    return this.eventCheckinsService.update(+id, updateEventCheckinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventCheckinsService.remove(+id);
  }
}
