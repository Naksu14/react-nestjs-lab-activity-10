import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { Event } from '../../events/entities/event.entity';
import { EventRegistration } from '../../event-registrations/entities/event-registration.entity';

export enum TicketStatus {
  VALID = 'valid',
  USED = 'used',
  CANCELLED = 'cancelled',
}

@Entity('event_tickets')
export class EventTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  ticket_code: string;

  @Column()
  event_id: number;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column()
  registration_id: string;

  @ManyToOne(() => EventRegistration)
  @JoinColumn({ name: 'registration_id' })
  registration: EventRegistration;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.VALID })
  status: TicketStatus;

  @CreateDateColumn({ type: 'timestamp' })
  issued_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiration_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  used_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @BeforeInsert()
  generateCode() {
    if (!this.ticket_code) this.ticket_code = randomUUID();
  }
}
