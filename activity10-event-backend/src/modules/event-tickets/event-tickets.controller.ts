import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EventTicketsService } from './event-tickets.service';
import { CreateEventTicketDto } from './dto/create-event-ticket.dto';
import { UpdateEventTicketDto } from './dto/update-event-ticket.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('event-tickets')
@Controller('event-tickets')
export class EventTicketsController {
  constructor(private readonly eventTicketsService: EventTicketsService) {}

  // Create a new event ticket
  @Post()
  @ApiOperation({ summary: 'Create a new event ticket' })
  @ApiResponse({ status: 201, description: 'The created event ticket', type: CreateEventTicketDto })
  create(@Body() createEventTicketDto: CreateEventTicketDto) {
    return this.eventTicketsService.create(createEventTicketDto);
  }

  // Get all event tickets
  @Get()
  @ApiOperation({ summary: 'Get all event tickets' })
  @ApiResponse({ status: 200, description: 'List of event tickets', type: [CreateEventTicketDto] })
  findAll() {
    return this.eventTicketsService.findAll();
  }

  // Get a single event ticket by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get event ticket by ID' })
  @ApiResponse({ status: 200, description: 'Event ticket', type: CreateEventTicketDto })
  findOne(@Param('id') id: string) {
    return this.eventTicketsService.findOne(+id);
  }

  @Get('ticket-code/:ticketCode')
  @ApiOperation({ summary: 'Get event ticket by ticket code' })
  @ApiResponse({ status: 200, description: 'Event ticket', type: CreateEventTicketDto })
  @UseGuards(AuthGuard('jwt'))
  findByTicketCode(@Param('ticketCode') ticketCode: string) {
    return this.eventTicketsService.findByTicketCode(ticketCode);
  }

  // Update an existing event ticket
  @Patch(':id')
  @ApiOperation({ summary: 'Update an event ticket' })
  @ApiResponse({ status: 200, description: 'The updated event ticket', type: CreateEventTicketDto })
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateEventTicketDto: UpdateEventTicketDto) {
    return this.eventTicketsService.update(+id, updateEventTicketDto);
  }

  // Delete an event ticket
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event ticket' })
  @ApiResponse({ status: 200, description: 'The deleted event ticket' })
  remove(@Param('id') id: string) {
    return this.eventTicketsService.remove(+id);
  }
}
