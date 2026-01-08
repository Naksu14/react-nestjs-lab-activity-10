import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventUser } from './entities/event-user.entity';
import { EventUsersService } from './event-users.service';
import { CreateEventUserDto } from './dto/create-event-user.dto';
import { UpdateEventUserDto } from './dto/update-event-user.dto';

@Controller('event-users')
export class EventUsersController {
  constructor(private readonly eventUsersService: EventUsersService) {}

  @Get()
  async getAllUsers() {
    return this.eventUsersService.getAllUsers();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Req() req: any): Promise<EventUser | null> {
    // request.user is attached by JwtStrategy validate()
    const user = req.user;
    if (!user) return null;
    // if user is full entity, return as-is, otherwise fetch from DB
    if (user.id) return this.eventUsersService.getUserById(user.id);
    return null;
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EventUser | null> {
    return this.eventUsersService.getUserById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateEventUserDto): Promise<EventUser> {
    return this.eventUsersService.create(createUserDto);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Req() req: any,
    @Body() updateData: Partial<EventUser>,
  ): Promise<EventUser | null> {
    return this.eventUsersService.updateUser(req.user.id, updateData);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.eventUsersService.deleteUser(id);
  }
}
