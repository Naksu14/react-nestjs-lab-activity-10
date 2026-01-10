import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';
import {
  EventRegistration,
  RegistrationStatus,
} from './entities/event-registration.entity';
import { Event } from '../events/entities/event.entity';
import { EventUser } from '../event-users/entities/event-user.entity';
import { EventTicketsService } from '../event-tickets/event-tickets.service';
import { TicketStatus } from '../event-tickets/entities/event-ticket.entity';
import { randomUUID } from 'crypto';
import * as QRCode from 'qrcode';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EventRegistrationsService {
  constructor(
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationsRepository: Repository<EventRegistration>,
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(EventUser)
    private readonly usersRepository: Repository<EventUser>,
    private readonly eventTicketsService: EventTicketsService,
  ) { }

  // Create a new event registration
  async create(
    createEventRegistrationDto: CreateEventRegistrationDto,
  ): Promise<EventRegistration> {
    const event = await this.eventsRepository.findOneBy({
      id: createEventRegistrationDto.event_id,
    });

    const user = await this.usersRepository.findOneBy({
      id: createEventRegistrationDto.user_id,
    });
    if (!event) {
      throw new NotFoundException(
        `Event with id ${createEventRegistrationDto.event_id} not found`,
      );
    }
    if (!user) {
      throw new NotFoundException(
        `User with id ${createEventRegistrationDto.user_id} not found`,
      );
    }

    const registrationData: Partial<EventRegistration> = {
      event_id: createEventRegistrationDto.event_id,
      user_id: createEventRegistrationDto.user_id,
      registration_status:
        createEventRegistrationDto.registration_status ??
        RegistrationStatus.REGISTERED,
      event,
      user,
    };

    const registration =
      this.eventRegistrationsRepository.create(registrationData);
    const savedRegistration = await this.eventRegistrationsRepository.save(
      registration,
    );

    // Issue ticket with UUID code
    const ticketCode = randomUUID();
    const ticket = await this.eventTicketsService.create({
      ticket_code: ticketCode,
      event_id: event.id,
      registration_id: savedRegistration.id,
      status: TicketStatus.VALID,
    });

    await this.sendTicketEmail({
      to: user.email,
      attendeeName: `${user.firstname} ${user.lastname}`.trim(),
      eventTitle: event.title_event,
      eventLocation: event.location,
      startDate: event.start_datetime,
      endDate: event.end_datetime,
      ticketCode,
    });

    return { ...savedRegistration, ticket } as any;
  }

  // Get all event registrations
  async findAll(): Promise<EventRegistration[]> {
    return this.eventRegistrationsRepository.find({
      relations: ['event', 'user'],
    });
  }

  // Get event registration by ID
  async findOne(id: number): Promise<EventRegistration> {
    const registration = await this.eventRegistrationsRepository.findOne({
      where: { id },
      relations: ['event', 'user'],
    });
    if (!registration) {
      throw new NotFoundException(`Registration with id ${id} not found`);
    }
    return registration;
  }

    // get event registration by user and event
  async findByEventId(eventId: number): Promise<EventRegistration[]> {
    return this.eventRegistrationsRepository.find({
      where: { event_id: eventId },
      relations: ['event', 'user'],
    });
  }

  // Get registrations for all events owned by an organizer
  async findByOrganizerId(organizerId: number): Promise<EventRegistration[]> {
    return this.eventRegistrationsRepository.find({
      where: { event: { organizer: { id: organizerId } } },
      relations: ['event', 'event.organizer', 'user'],
    });
  }


  // Update an event registration
  async update(
    id: number,
    updateEventRegistrationDto: UpdateEventRegistrationDto,
  ): Promise<EventRegistration> {
    const registration = await this.findOne(id);

    if (updateEventRegistrationDto.registration_status === RegistrationStatus.CANCELLED) {
      registration.registration_status = RegistrationStatus.CANCELLED;
      registration.cancelled_at = new Date();
      registration.updated_at = new Date();
      await this.eventTicketsService.cancelByRegistrationId(registration.id);
    } else {
      Object.assign(registration, updateEventRegistrationDto);
      registration.updated_at = new Date();
    }

    return this.eventRegistrationsRepository.save(registration);
  }

  // Delete an event registration
  async remove(id: number): Promise<void> {
    const registration = await this.findOne(id);
    await this.eventRegistrationsRepository.remove(registration);
  }

  private async sendTicketEmail(params: {
    to: string;
    attendeeName: string;
    eventTitle: string;
    eventLocation: string;
    startDate: Date;
    endDate: Date;
    ticketCode: string;
  }) {
    const { to, attendeeName, eventTitle, eventLocation, startDate, endDate, ticketCode } = params;

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.warn('SMTP config missing; skipping email send');
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const qrBuffer = await QRCode.toBuffer(ticketCode, {
      type: 'png',
      errorCorrectionLevel: 'H',
    });

    const dateOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    const startLabel = startDate
      ? new Date(startDate).toLocaleString('en-US', dateOptions)
      : 'Start date TBA';
    const endLabel = endDate
      ? new Date(endDate).toLocaleString('en-US', dateOptions)
      : 'End date TBA';

    const html = `
  <div style="
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f5f7fa;
    padding: 24px;
  ">
    <div style="
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    ">
      <div style="
        background-color: #4f46e5;
        padding: 20px;
        text-align: center;
        color: #ffffff;
      ">
        <h2 style="margin: 0; font-size: 22px;">
          🎟 Event Registration Confirmed
        </h2>
      </div>

      <div style="padding: 24px; color: #111827;">
        <p style="font-size: 15px; margin: 0 0 16px;">
          Hello <strong>${attendeeName || 'Attendee'}</strong>,
        </p>

        <p style="font-size: 15px; margin: 0 0 16px;">
          You’re successfully registered for:
        </p>

        <h3 style="margin: 0 0 16px; color: #4f46e5;">
          ${eventTitle}
        </h3>

        <table style="width: 100%; font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Start</td>
            <td style="padding: 6px 0; font-weight: 600;">${startLabel}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Until</td>
            <td style="padding: 6px 0; font-weight: 600;">${endLabel}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Location</td>
            <td style="padding: 6px 0; font-weight: 600;">
              ${eventLocation || 'Location to be announced'}
            </td>
          </tr>
        </table>

        <div style="text-align: center; margin: 24px 0;">
          <p style="font-size: 14px; margin-bottom: 12px;">
            Please present this QR code at the entrance:
          </p>
          <img
            src="cid:ticketqr"
            alt="Ticket QR"
            style="width:220px;height:220px;border:1px solid #e5e7eb;border-radius:8px;"
          />
        </div>

        <p style="font-size: 13px; color: #6b7280; margin-top: 24px;">
          If you have any questions, simply reply to this email.
        </p>
      </div>

      <div style="
        background-color: #f3f4f6;
        text-align: center;
        padding: 12px;
        font-size: 12px;
        color: #6b7280;
      ">
        © ${new Date().getFullYear()} QRserve. All rights reserved.
      </div>
    </div>
  </div>
`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || user,
      to,
      subject: `Your ticket for ${eventTitle}`,
      html,
      attachments: [
        {
          filename: 'ticket-qr.png',
          content: qrBuffer,
          cid: 'ticketqr',
          contentType: 'image/png',
        },
      ],
    });
  }
}
