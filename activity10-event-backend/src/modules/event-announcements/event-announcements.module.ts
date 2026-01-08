import { Module } from '@nestjs/common';
import { EventAnnouncementsService } from './event-announcements.service';
import { EventAnnouncementsController } from './event-announcements.controller';

@Module({
  controllers: [EventAnnouncementsController],
  providers: [EventAnnouncementsService],
})
export class EventAnnouncementsModule {}
