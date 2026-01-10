import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventAnnouncementDto } from './dto/create-event-announcement.dto';
import { UpdateEventAnnouncementDto } from './dto/update-event-announcement.dto';
import { EventAnnouncement } from './entities/event-announcement.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class EventAnnouncementsService {
  constructor(
    @InjectRepository(EventAnnouncement)
    private readonly eventAnnouncementsRepository: Repository<EventAnnouncement>,
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  // Create a new event announcement
  async create(createEventAnnouncementDto: CreateEventAnnouncementDto) {
    const event = await this.eventsRepository.findOneBy({
      id: createEventAnnouncementDto.event_id,
    });
    if (!event) {
      throw new Error('Event not found');
    }

    const eventAnnouncement = this.eventAnnouncementsRepository.create(
      createEventAnnouncementDto,
    );
    return this.eventAnnouncementsRepository.save(eventAnnouncement);
  }

  // Get all event announcements
  async findAll() {
    return this.eventAnnouncementsRepository.find();
  }

  async findAllAnnouncementsBySender(senderId: number) {
    return this.eventAnnouncementsRepository.find({
      where: { sent_by: senderId },
      order: { sent_at: 'DESC' },
      relations: ['sender', 'event'],
    });
  }

  // Get all announcements for a specific event
  async findByEvent(eventId: number) {
    return this.eventAnnouncementsRepository.find({
      where: { event_id: eventId },
      order: { sent_at: 'DESC' },
      relations: ['sender'],
    });
  }

  // Get a single event announcement by ID
  async findOne(id: number): Promise<EventAnnouncement> {
    const announcement = await this.eventAnnouncementsRepository.findOneBy({
      id,
    });
    if (!announcement) {
      throw new NotFoundException(`Event announcement with id ${id} not found`);
    }
    return announcement;
  }

  // Update an event announcement
  async update(
    id: number,
    updateEventAnnouncementDto: UpdateEventAnnouncementDto,
  ) {
    const eventAnnouncement = await this.findOne(id);
    Object.assign(eventAnnouncement, updateEventAnnouncementDto);
    return this.eventAnnouncementsRepository.save(eventAnnouncement);
  }

  // Delete an event announcement
  async remove(id: number) {
    const eventAnnouncement = await this.findOne(id);
    return this.eventAnnouncementsRepository.remove(eventAnnouncement);
  }
}
