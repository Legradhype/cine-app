import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { MoviesService } from '../movies/movies.service';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimesRepository: Repository<Showtime>,
    private readonly moviesService: MoviesService,
    private readonly roomsService: RoomsService,
  ) {}

  private async checkOverlap(
    roomId: number,
    startTime: Date,
    endTime: Date,
    excludeId?: number,
  ): Promise<void> {
    const queryBuilder = this.showtimesRepository
      .createQueryBuilder('showtime')
      .where('showtime.roomId = :roomId', { roomId })
      .andWhere('showtime.startTime < :endTime', { endTime })
      .andWhere('showtime.endTime > :startTime', { startTime });

    if (excludeId) {
      queryBuilder.andWhere('showtime.id != :excludeId', { excludeId });
    }

    const overlapping = await queryBuilder.getOne();

    if (overlapping) {
      throw new ConflictException(
        'Ya existe una función programada para esta sala en el horario seleccionado.',
      );
    }
  }

  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    await this.moviesService.findOne(createShowtimeDto.movieId);
    await this.roomsService.findOne(createShowtimeDto.roomId);

    const startTime = new Date(createShowtimeDto.startTime);
    const endTime = new Date(createShowtimeDto.endTime);

    if (endTime <= startTime) {
      throw new BadRequestException(
        'La fecha y hora de fin debe ser posterior a la de inicio.',
      );
    }

    await this.checkOverlap(createShowtimeDto.roomId, startTime, endTime);

    const showtime = this.showtimesRepository.create({
      movieId: createShowtimeDto.movieId,
      roomId: createShowtimeDto.roomId,
      startTime,
      endTime,
      price: createShowtimeDto.price,
      status: createShowtimeDto.status,
    });

    return this.showtimesRepository.save(showtime);
  }

  async findAll(): Promise<Showtime[]> {
    return this.showtimesRepository.find({
      relations: ['movie', 'room'],
      order: { startTime: 'ASC' },
    });
  }

  async findByMovie(movieId: number): Promise<Showtime[]> {
    return this.showtimesRepository.find({
      where: { movieId },
      relations: ['room'],
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Showtime> {
    const showtime = await this.showtimesRepository.findOne({
      where: { id },
      relations: ['movie', 'room'],
    });

    if (!showtime) {
      throw new NotFoundException('La función no existe.');
    }

    return showtime;
  }

  async update(id: number, updateShowtimeDto: UpdateShowtimeDto): Promise<Showtime> {
    const showtime = await this.findOne(id);

    if (updateShowtimeDto.movieId) {
      await this.moviesService.findOne(updateShowtimeDto.movieId);
    }

    if (updateShowtimeDto.roomId) {
      await this.roomsService.findOne(updateShowtimeDto.roomId);
    }

    const roomId = updateShowtimeDto.roomId ?? showtime.roomId;
    const startTime = updateShowtimeDto.startTime
      ? new Date(updateShowtimeDto.startTime)
      : showtime.startTime;
    const endTime = updateShowtimeDto.endTime
      ? new Date(updateShowtimeDto.endTime)
      : showtime.endTime;

    if (endTime <= startTime) {
      throw new BadRequestException(
        'La fecha y hora de fin debe ser posterior a la de inicio.',
      );
    }

    await this.checkOverlap(roomId, startTime, endTime, id);

    Object.assign(showtime, {
      ...updateShowtimeDto,
      startTime,
      endTime,
    });

    return this.showtimesRepository.save(showtime);
  }


  async remove(id: number): Promise<void> {
    const showtime = await this.findOne(id);
    await this.showtimesRepository.remove(showtime);
  }


  async findOneWithRoom(id: number): Promise<Showtime> {
    const showtime = await this.showtimesRepository.findOne({
      where: { id },
      relations: ['room', 'movie'],
    });

    if (!showtime) {
      throw new NotFoundException('La función no existe.');
    }

    return showtime;
  }
}