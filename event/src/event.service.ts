import { Model, Types } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

type EventSummary = Pick<Event, 'title' | 'startDate'>;

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const event = new this.eventModel(dto);
    return await event.save();
  }

  async summaryList(): Promise<EventSummary[]> {
    return this.eventModel
      .find({}, { title: 1, startDate: 1, _id: 1 })
      .sort({ startDate: -1 });
  }

  async searchById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('잘못된 이벤트 ID 형식입니다.');
    }

    // isValid는 24자리 여부만 보므로, 12-byte Buffer까지 허용하려면 아래처럼 추가 검사
    if (new Types.ObjectId(id).toString() !== id) {
      throw new BadRequestException('잘못된 이벤트 ID 형식입니다.');
    }

    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

    return event;
  }
}
