import { Module } from '@nestjs/common';
import { EventRegistrationsService } from './event-registrations.service';
import { EventRegistrationsController } from './event-registrations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRegistration } from './entities/event-registration.entity';
import { Event } from '../events/entities/event.entity';
import { EventUser } from '../event-users/entities/event-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventRegistration, Event, EventUser]),
  ],
  controllers: [EventRegistrationsController],
  providers: [EventRegistrationsService],
  exports: [EventRegistrationsService],
})
export class EventRegistrationsModule {}
