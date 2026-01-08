import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';
import { EventUsersModule } from './modules/event-users/event-users.module';
import { EventTicketsModule } from './modules/event-tickets/event-tickets.module';
import { EventRegistrationsModule } from './modules/event-registrations/event-registrations.module';
import { EventCheckinsModule } from './modules/event-checkins/event-checkins.module';
import { EventAnnouncementsModule } from './modules/event-announcements/event-announcements.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    AuthModule,
    EventsModule,
    EventUsersModule,
    EventTicketsModule,
    EventRegistrationsModule,
    EventCheckinsModule,
    EventAnnouncementsModule,
  ],
})
export class AppModule {}
