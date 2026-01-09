import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventTicket } from '../../event-tickets/entities/event-ticket.entity';
import { Event } from '../../events/entities/event.entity';
import { EventUser } from '../../event-users/entities/event-user.entity';

export enum ScanStatus {
  SUCCESS = 'success',
  INVALID = 'invalid',
}

@Entity('event_checkins')
export class EventCheckin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticket_id: number;

  @ManyToOne(() => EventTicket)
  @JoinColumn({ name: 'ticket_id' })
  ticket: EventTicket;

  @Column()
  event_id: number;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column()
  scanned_by: number;

  @ManyToOne(() => EventUser)
  @JoinColumn({ name: 'scanned_by' })
  scannedBy: EventUser;

  @Column({ type: 'enum', enum: ScanStatus, default: ScanStatus.SUCCESS })
  scan_status: ScanStatus;

  @Column({ type: 'timestamp', nullable: true })
  scan_time: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
