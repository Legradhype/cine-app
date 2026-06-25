import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const existing = await this.roomsRepository.findOne({
      where: { name: createRoomDto.name },
    });

    if (existing) {
      throw new ConflictException('Ya existe una sala con ese nombre.');
    }

    const room = this.roomsRepository.create(createRoomDto);
    return this.roomsRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return this.roomsRepository.find({ order: { name: 'ASC' } });
  }


  async findOne(id: number): Promise<Room> {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException('La sala seleccionada no existe.');
    }
    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.findOne(id);

    if (updateRoomDto.name && updateRoomDto.name !== room.name) {
      const existing = await this.roomsRepository.findOne({
        where: { name: updateRoomDto.name },
      });
      if (existing) {
        throw new ConflictException('Ya existe una sala con ese nombre.');
      }
    }

    Object.assign(room, updateRoomDto);
    return this.roomsRepository.save(room);
  }

  async remove(id: number): Promise<void> {
    const room = await this.findOne(id);
    await this.roomsRepository.remove(room);
  }
}