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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('event-users')
@Controller('event-users')
export class EventUsersController {
  constructor(private readonly eventUsersService: EventUsersService) {}

  // Get all users
  @Get()
  @ApiOperation({ summary: 'Get all event users' })
  @ApiResponse({ status: 200, description: 'List of event users', type: [CreateEventUserDto] })
  async getAllUsers() {
    return this.eventUsersService.getAllUsers();
  }

  // Get current authenticated user
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user', type: CreateEventUserDto })
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Req() req: any): Promise<EventUser | null> {
    // request.user is attached by JwtStrategy validate()
    const user = req.user;
    if (!user) return null;
    // if user is full entity, return as-is, otherwise fetch from DB
    if (user.id) return this.eventUsersService.getUserById(user.id);
    return null;
  }

  // Get user by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get event user by ID' })
  @ApiResponse({ status: 200, description: 'Event user', type: CreateEventUserDto })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EventUser | null> {
    return this.eventUsersService.getUserById(id);
  }

  // Create a new user
  @Post()
  @ApiOperation({ summary: 'Create a new event user' })
  @ApiResponse({ status: 201, description: 'The created event user', type: CreateEventUserDto })
  async createUser(@Body() createUserDto: CreateEventUserDto): Promise<EventUser> {
    return this.eventUsersService.create(createUserDto);
  }

  // Update current authenticated user
  @Patch('me')
  @ApiOperation({ summary: 'Update current authenticated user' })
  @ApiResponse({ status: 200, description: 'The updated event user', type: UpdateEventUserDto })
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Req() req: any,
    @Body() updateEventUserDto: Partial<EventUser>,
  ): Promise<EventUser | null> {
    return this.eventUsersService.updateUser(req.user.id, updateEventUserDto);
  }

  // Delete user by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete event user by ID' })
  @ApiResponse({ status: 200, description: 'Event user deleted' })
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.eventUsersService.deleteUser(id);
  }
}
