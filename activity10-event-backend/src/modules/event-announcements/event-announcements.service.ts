import { Injectable } from '@nestjs/common';
import { CreateEventAnnouncementDto } from './dto/create-event-announcement.dto';
import { UpdateEventAnnouncementDto } from './dto/update-event-announcement.dto';

@Injectable()
export class EventAnnouncementsService {
  create(createEventAnnouncementDto: CreateEventAnnouncementDto) {
    return 'This action adds a new eventAnnouncement';
  }

  findAll() {
    return `This action returns all eventAnnouncements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventAnnouncement`;
  }

  update(id: number, updateEventAnnouncementDto: UpdateEventAnnouncementDto) {
    return `This action updates a #${id} eventAnnouncement`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventAnnouncement`;
  }
}
