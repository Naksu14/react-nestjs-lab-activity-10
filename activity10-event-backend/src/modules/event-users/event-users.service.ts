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

  async getAllUsers(): Promise<EventUser[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'firstname', 'lastname', 'isActive'],
    });
  }

  async getUserById(id: number): Promise<EventUser | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstname', 'lastname', 'isActive'],
    });
  }

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

  async updateUser(
    id: number,
    updateData: Partial<EventUser>,
  ): Promise<EventUser | null> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    await this.usersRepository.update(id, updateData);
    return this.usersRepository.findOneBy({ id });
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
