import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { EventUser } from '../../event-users/entities/event-user.entity';

@Entity('event_announcements')
export class EventAnnouncement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_id: number;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column()
  sent_by: number;

  @ManyToOne(() => EventUser)
  @JoinColumn({ name: 'sent_by' })
  sender: EventUser;

  @CreateDateColumn({ type: 'timestamp' })
  sent_at: Date;
}
