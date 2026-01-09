import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTicketsService } from './event-tickets.service';
import { EventTicketsController } from './event-tickets.controller';
import { EventTicket } from './entities/event-ticket.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventTicket, Event])],
  controllers: [EventTicketsController],
  providers: [EventTicketsService],
  exports: [EventTicketsService],
})
export class EventTicketsModule {}
