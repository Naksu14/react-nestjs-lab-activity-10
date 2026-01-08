import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventUsersService } from './event-users.service';
import { EventUsersController } from './event-users.controller';
import { EventUser } from './entities/event-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventUser])],
  controllers: [EventUsersController],
  providers: [EventUsersService],
  exports: [EventUsersService],
})
export class EventUsersModule {}
