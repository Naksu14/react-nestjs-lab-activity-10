import { Injectable } from '@nestjs/common';
import { CreateEventCheckinDto } from './dto/create-event-checkin.dto';
import { UpdateEventCheckinDto } from './dto/update-event-checkin.dto';

@Injectable()
export class EventCheckinsService {
  create(createEventCheckinDto: CreateEventCheckinDto) {
    return 'This action adds a new eventCheckin';
  }

  findAll() {
    return `This action returns all eventCheckins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventCheckin`;
  }

  update(id: number, updateEventCheckinDto: UpdateEventCheckinDto) {
    return `This action updates a #${id} eventCheckin`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventCheckin`;
  }
}
