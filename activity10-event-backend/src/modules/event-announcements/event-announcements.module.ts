import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventAnnouncementsService } from './event-announcements.service';
import { EventAnnouncementsController } from './event-announcements.controller';
import { EventAnnouncement } from './entities/event-announcement.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventAnnouncement, Event])],
  controllers: [EventAnnouncementsController],
  providers: [EventAnnouncementsService],
  exports: [EventAnnouncementsService],
})
export class EventAnnouncementsModule {}
