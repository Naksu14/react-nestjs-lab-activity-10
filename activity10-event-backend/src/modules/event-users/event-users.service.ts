import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EventUser } from './entities/event-user.entity';
import { CreateEventUserDto } from './dto/create-event-user.dto';
import { UpdateEventUserDto } from './dto/update-event-user.dto';

@Injectable()
export class EventUsersService {
  constructor(
    @InjectRepository(EventUser)
    private usersRepository: Repository<EventUser>,
  ) {}

  // Get all users
  async getAllUsers(): Promise<EventUser[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'firstname', 'lastname', 'role', 'isActive', 'isArchived'],
    });
  }

  // Get all organizers
  async getAllOrganizers(): Promise<EventUser[]> {
    return this.usersRepository.find({
      where: { role: 'organizer' },
      select: ['id', 'email', 'firstname', 'lastname', 'role', 'isActive', 'isArchived'],
    });
  }

  // Get all attendees
  async getAllAttendees(): Promise<EventUser[]> {
    return this.usersRepository.find({
      where: { role: 'attendee' },
      select: ['id', 'email', 'firstname', 'lastname', 'role', 'isActive', 'isArchived'],
    });
  }

  // Get current authenticated user
  async getUserById(id: number): Promise<EventUser | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstname', 'lastname', 'isActive', 'isArchived'],
    });
  }

  // Create a new user
  async create(createUserDto: CreateEventUserDto): Promise<EventUser> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    try {
      return await this.usersRepository.save(newUser);
    } catch (error) {
      // handle duplicate email unique constraint from the database
      const isDuplicate =
        error &&
        (error.code === 'ER_DUP_ENTRY' ||
          error.errno === 1062 ||
          error.code === '23505');
      if (isDuplicate) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  // Archive user
  async archiveUser(id: number){
    const userId = await this.usersRepository.findOneBy({id});
    if (!userId) {
      return null;
    }
    await this.usersRepository.update(id, { isArchived: true });
  }

  // Restore user
  async restoreUser(id: number){
    const userId = await this.usersRepository.findOneBy({id});
    if (!userId) {
      return null;
    }
    await this.usersRepository.update(id, { isArchived: false });
    return this.usersRepository.findOneBy({ id });
  }

  // get all archived users
  async getArchivedUsers(): Promise<EventUser[]> {
    return this.usersRepository.find({
      where: { isArchived: true },
      select: ['id', 'email', 'firstname', 'lastname', 'isActive', 'isArchived'],
    });
  }

  // attendees signup
  async registerAttendee(
    createUserDto: CreateEventUserDto,
  ): Promise<EventUser | { message: string }> {
    
    const existing = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existing) {
      return { message: 'Email already exists' };
    }

    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      isActive: true,
    });
    return await this.usersRepository.save(newUser);
  }
  
  // Update current authenticated user
  async updateUser(
    id: number,
    updateEventUserDto: UpdateEventUserDto,
  ): Promise<EventUser | null> {
    if (updateEventUserDto.password) {
      updateEventUserDto.password = await bcrypt.hash(
        updateEventUserDto.password,
        10,
      );
    }
    await this.usersRepository.update(id, updateEventUserDto);
    return this.usersRepository.findOneBy({ id });
  }

  // Delete user by ID
  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
