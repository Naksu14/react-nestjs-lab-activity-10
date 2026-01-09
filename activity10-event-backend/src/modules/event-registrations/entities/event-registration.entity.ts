import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { EventUser } from '../../event-users/entities/event-user.entity';

export enum RegistrationStatus {
  REGISTERED = 'registered',
  CANCELLED = 'cancelled',
}

@Entity('event_registrations')
export class EventRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_id: number;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column()
  user_id: number;

  @ManyToOne(() => EventUser)
  @JoinColumn({ name: 'user_id' })
  user: EventUser;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.REGISTERED,
  })
  registration_status: RegistrationStatus;

  @CreateDateColumn({ type: 'timestamp' })
  registered_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
