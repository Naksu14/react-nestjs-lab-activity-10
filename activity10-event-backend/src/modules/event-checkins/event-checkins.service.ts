import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventCheckinDto } from './dto/create-event-checkin.dto';
import { UpdateEventCheckinDto } from './dto/update-event-checkin.dto';
import { EventCheckin } from './entities/event-checkin.entity';
import { Event } from '../events/entities/event.entity';
import { EventTicket } from '../event-tickets/entities/event-ticket.entity';
import { ScanStatus } from './entities/event-checkin.entity';

@Injectable()
export class EventCheckinsService {

  constructor(
    @InjectRepository(EventCheckin)
    private readonly eventCheckinsRepository: Repository<EventCheckin>,
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(EventTicket)
    private readonly eventTicketsRepository: Repository<EventTicket>,
  ) {}

  // Create a new event check-in
  async create(
    createEventCheckinDto: CreateEventCheckinDto,
  ): Promise<EventCheckin> {
    const event = await this.eventsRepository.findOneBy({
      id: createEventCheckinDto.event_id,
    });
    const ticket = await this.eventTicketsRepository.findOneBy({
      id: createEventCheckinDto.ticket_id,
    });
    if (!event) {
      throw new Error(
        `Event with id ${createEventCheckinDto.event_id} not found`,
      );
    }
    if (!ticket) {
      throw new Error(
        `Ticket with id ${createEventCheckinDto.ticket_id} not found`,
      );
    }
    const checkinData: Partial<EventCheckin> = {
      ticket_id: createEventCheckinDto.ticket_id,
      event_id: createEventCheckinDto.event_id,
      scanned_by: createEventCheckinDto.scanned_by,
      scan_time: createEventCheckinDto.scan_time
        ? new Date(createEventCheckinDto.scan_time)
        : new Date(),
      scan_status:
        createEventCheckinDto.scan_status ?? ScanStatus.SUCCESS,
      event,
      ticket,
    };
    const checkin = this.eventCheckinsRepository.create(checkinData);
    return this.eventCheckinsRepository.save(checkin);
  }

  // Get all event check-ins
  async findAll() {
    return this.eventCheckinsRepository.find({
      relations: ['event', 'ticket'],
    });
  }

  // Get a single event check-in by ID
  async findOne(id: number) {
    return this.eventCheckinsRepository.findOne({
      where: { id },
      relations: ['event', 'ticket'],
    });
  }

  // Update an existing event check-in
  async update(id: number, updateEventCheckinDto: UpdateEventCheckinDto) {
    const checkin = await this.findOne(id);
    if (!checkin) {
      throw new Error(`Event check-in with id ${id} not found`);
    }
    Object.assign(checkin, updateEventCheckinDto);
    return this.eventCheckinsRepository.save(checkin);
  }

  // Delete an event check-in
  async remove(id: number) {
    const checkin = await this.findOne(id);
    if (!checkin) {
      throw new Error(`Event check-in with id ${id} not found`);
    }
    await this.eventCheckinsRepository.remove(checkin);

    return { message: `Event check-in with id ${id} has been removed` };
  }
}
