import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventCheckinsService } from './event-checkins.service';
import { EventCheckinsController } from './event-checkins.controller';
import { Event } from '../events/entities/event.entity';
import { EventTicket } from '../event-tickets/entities/event-ticket.entity';
import { EventCheckin } from './entities/event-checkin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventCheckin, Event, EventTicket]),
  ],
  controllers: [EventCheckinsController],
  providers: [EventCheckinsService],
  exports: [EventCheckinsService],
})
export class EventCheckinsModule {}
