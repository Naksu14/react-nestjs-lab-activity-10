import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { EventUser } from '../event-users/entities/event-user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(EventUser)
    private readonly userRepository: Repository<EventUser>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<EventUser> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }

  async login(user: EventUser): Promise<{ accessToken: string }> {
    const payload = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
