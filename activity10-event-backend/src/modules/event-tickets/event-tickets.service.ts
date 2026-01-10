import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventTicketDto } from './dto/create-event-ticket.dto';
import { UpdateEventTicketDto } from './dto/update-event-ticket.dto';
import { EventTicket, TicketStatus } from './entities/event-ticket.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class EventTicketsService {
  constructor(
    @InjectRepository(EventTicket)
    private readonly eventTicketsRepository: Repository<EventTicket>,
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  // Create a new event ticket
  async create(
    createEventTicketDto: CreateEventTicketDto,
  ): Promise<EventTicket> {
    const event = await this.eventsRepository.findOneBy({
      id: createEventTicketDto.event_id,
    });
    if (!event) {
      throw new Error(
        `Event with id ${createEventTicketDto.event_id} not found`,
      );
    }
    const ticketData: Partial<EventTicket> = {
      ticket_code: createEventTicketDto.ticket_code,
      event_id: createEventTicketDto.event_id,
      registration_id: createEventTicketDto.registration_id,
      status: createEventTicketDto.status ?? TicketStatus.VALID,
      expiration_at: createEventTicketDto.expiration_at
        ? new Date(createEventTicketDto.expiration_at)
        : null,
      used_at: createEventTicketDto.used_at
        ? new Date(createEventTicketDto.used_at)
        : null,
      event,
    };
    const ticket = this.eventTicketsRepository.create(ticketData);
    return this.eventTicketsRepository.save(ticket);
  }

  // Get all event tickets
  async findAll() {
    return this.eventTicketsRepository.find({
      relations: ['event', 'registration', 'registration.user'],
    });
  }

  // Get a single event ticket by ID
  async findOne(id: number) {
    return this.eventTicketsRepository.findOne({
      where: { id },
      relations: ['event', 'registration', 'registration.user'],
    });
  }

  async cancelByRegistrationId(registrationId: number) {
    if (!registrationId) return;

    const tickets = await this.eventTicketsRepository.find({
      where: { registration_id: registrationId },
    });

    if (!tickets.length) return;

    for (const ticket of tickets) {
      ticket.status = TicketStatus.CANCELLED;
    }

    await this.eventTicketsRepository.save(tickets);
  }

  // Update an existing event ticket
  async update(id: number, updateEventTicketDto: UpdateEventTicketDto) {
    const ticket = await this.findOne(id);
    if (!ticket) {
      throw new Error(`Event ticket with id ${id} not found`);
    }
    Object.assign(ticket, updateEventTicketDto);
    return this.eventTicketsRepository.save(ticket);
  }

  // Delete an event ticket
  async remove(id: number) {
    const ticket = await this.findOne(id);
    if (!ticket) {
      throw new Error(`Event ticket with id ${id} not found`);
    }
    await this.eventTicketsRepository.remove(ticket);

    return { message: `Event ticket with id ${id} has been removed` };
  }
}
