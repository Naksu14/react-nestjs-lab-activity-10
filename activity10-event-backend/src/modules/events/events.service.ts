import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventUser } from '../event-users/entities/event-user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(EventUser)
    private readonly usersRepository: Repository<EventUser>,
  ) {}

  // Create a new event
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const organizer = await this.usersRepository.findOneBy({
      id: createEventDto.organizer_id,
    });

    if (!organizer) {
      throw new NotFoundException(
        `Organizer with id ${createEventDto.organizer_id} not found`,
      );
    }

    const { organizer_id, ...eventData } = createEventDto;

    const event = this.eventsRepository.create({
      ...eventData,
      organizer,
    });

    return this.eventsRepository.save(event);
  }

  // Get all events
  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['organizer'],
    });
  }

  async getAllEventsByOrganizer(organizerId: number): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { organizer: { id: organizerId } },
      relations: ['organizer'],
    });
  }

  // Get a single event by ID
  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return event;
  }

  // Update an existing event
  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    Object.assign(event, updateEventDto);

    return this.eventsRepository.save(event);
  }

  // Delete an event
  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
  }
}
