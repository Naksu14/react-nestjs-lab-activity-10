import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';

// Simple, shared upload folder for event images
const uploadDir = join(process.cwd(), 'event-images');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const eventImageStorage = diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // create a new event
  @Post()
  @UseInterceptors(
    FileInterceptor('eventImage', {
      storage: eventImageStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: 201,
    description: 'The created event',
    type: CreateEventDto,
  })
  create(@UploadedFile() file: any, @Body() createEventDto: CreateEventDto) {
    if (file) {
      createEventDto.eventImage = `/event-images/${file.filename}`;
    }

    return this.eventsService.create(createEventDto);
  }

  // get all events
  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({
    status: 200,
    description: 'List of events',
    type: [CreateEventDto],
  })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('organizer')
  @ApiOperation({ summary: 'Get all events for the current organizer' })
  @ApiResponse({
    status: 200,
    description: 'List of events for the organizer',
    type: [CreateEventDto],
  })
  @UseGuards(AuthGuard('jwt'))
  getEventsByOrganizer(@Request() req) {
    const organizerId = req.user.id;
    return this.eventsService.getAllEventsByOrganizer(organizerId);
  }

  // get a specific event by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({
    status: 200,
    description: 'Event details',
    type: CreateEventDto,
  })
  findOne(@Param('id') id: number) {
    return this.eventsService.findOne(id);
  }

  // update an event by ID
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('eventImage', {
      storage: eventImageStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({
    status: 200,
    description: 'The updated event',
    type: UpdateEventDto,
  })
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: number,
    @UploadedFile() file: any,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    if (file) {
      updateEventDto.eventImage = `/event-images/${file.filename}`;
    }
    return this.eventsService.update(id, updateEventDto);
  }

  // delete an event by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({ status: 200, description: 'The deleted event' })
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: number) {
    return this.eventsService.remove(id);
  }
}
