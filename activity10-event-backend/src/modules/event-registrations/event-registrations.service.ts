import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';
import {
  EventRegistration,
  RegistrationStatus,
} from './entities/event-registration.entity';
import { Event } from '../events/entities/event.entity';
import { EventUser } from '../event-users/entities/event-user.entity';

@Injectable()
export class EventRegistrationsService {
  constructor(
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationsRepository: Repository<EventRegistration>,
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(EventUser)
    private readonly usersRepository: Repository<EventUser>,
  ) {}

  // Create a new event registration
  async create(
    createEventRegistrationDto: CreateEventRegistrationDto,
  ): Promise<EventRegistration> {
    const event = await this.eventsRepository.findOneBy({
      id: createEventRegistrationDto.event_id,
    });

    const user = await this.usersRepository.findOneBy({
      id: createEventRegistrationDto.user_id,
    });
    if (!event) {
      throw new NotFoundException(
        `Event with id ${createEventRegistrationDto.event_id} not found`,
      );
    }
    if (!user) {
      throw new NotFoundException(
        `User with id ${createEventRegistrationDto.user_id} not found`,
      );
    }

    const registrationData: Partial<EventRegistration> = {
      event_id: createEventRegistrationDto.event_id,
      user_id: createEventRegistrationDto.user_id,
      registration_status:
        createEventRegistrationDto.registration_status ??
        RegistrationStatus.REGISTERED,
      event,
      user,
    };

    const registration =
      this.eventRegistrationsRepository.create(registrationData);
    return this.eventRegistrationsRepository.save(registration);
  }

  // Get all event registrations
  async findAll(): Promise<EventRegistration[]> {
    return this.eventRegistrationsRepository.find({
      relations: ['event', 'user'],
    });
  }

  // Get event registration by ID
  async findOne(id: number): Promise<EventRegistration> {
    const registration = await this.eventRegistrationsRepository.findOne({
      where: { id },
      relations: ['event', 'user'],
    });
    if (!registration) {
      throw new NotFoundException(`Registration with id ${id} not found`);
    }
    return registration;
  }

  // Update an event registration
  async update(
    id: number,
    updateEventRegistrationDto: UpdateEventRegistrationDto,
  ): Promise<EventRegistration> {
    const registration = await this.findOne(id);
    Object.assign(registration, updateEventRegistrationDto);
    return this.eventRegistrationsRepository.save(registration);
  }

  // Delete an event registration
  async remove(id: number): Promise<void> {
    const registration = await this.findOne(id);
    await this.eventRegistrationsRepository.remove(registration);
  }
}
