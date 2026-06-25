import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationSeat } from './entities/reservation-seat.entity';
import { CreateReservationDto, SeatDto } from './dto/create-reservation.dto';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { User } from '../users/entities/user.entity';
import { ReservationStatus } from './enums/reservation-status.enum';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(ReservationSeat)
    private readonly reservationSeatsRepository: Repository<ReservationSeat>,
    private readonly showtimesService: ShowtimesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    user: User,
  ): Promise<Reservation> {
    const showtime = await this.showtimesService.findOneWithRoom(
      createReservationDto.showtimeId,
    );

    const room = showtime.room;

    for (const seat of createReservationDto.seats) {
      if (seat.rowIndex >= room.totalRows || seat.columnIndex >= room.totalColumns) {
        throw new BadRequestException(
          `El asiento fila ${seat.rowIndex}, columna ${seat.columnIndex} está fuera de los límites de la sala (${room.totalRows} filas x ${room.totalColumns} columnas).`,
        );
      }
    }

    const uniqueSeats = new Set(
      createReservationDto.seats.map((s) => `${s.rowIndex}-${s.columnIndex}`),
    );
    if (uniqueSeats.size !== createReservationDto.seats.length) {
      throw new BadRequestException(
        'No puede seleccionar el mismo asiento más de una vez.',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const seat of createReservationDto.seats) {
        const existing = await queryRunner.manager.findOne(ReservationSeat, {
          where: {
            showtimeId: createReservationDto.showtimeId,
            rowIndex: seat.rowIndex,
            columnIndex: seat.columnIndex,
          },
          lock: { mode: 'pessimistic_write' },
        });

        if (existing) {
          throw new ConflictException(
            'Uno o más asientos seleccionados ya fueron reservados.',
          );
        }
      }

      const priceAtPurchase = Number(showtime.price);
      const totalAmount = priceAtPurchase * createReservationDto.seats.length;

      const reservation = queryRunner.manager.create(Reservation, {
        userId: user.id,
        showtimeId: createReservationDto.showtimeId,
        priceAtPurchase,
        totalAmount,
        status: ReservationStatus.CONFIRMED,
      });

      const savedReservation = await queryRunner.manager.save(
        Reservation,
        reservation,
      );

      const reservationSeats = createReservationDto.seats.map((seat: SeatDto) =>
        queryRunner.manager.create(ReservationSeat, {
          reservationId: savedReservation.id,
          showtimeId: createReservationDto.showtimeId,
          rowIndex: seat.rowIndex,
          columnIndex: seat.columnIndex,
        }),
      );

      await queryRunner.manager.save(ReservationSeat, reservationSeats);

      await queryRunner.commitTransaction();

      const result = await this.reservationsRepository.findOne({
        where: { id: savedReservation.id },
        relations: ['seats', 'showtime', 'showtime.movie', 'showtime.room'],
      });

      if (!result) {
        throw new NotFoundException('No se encontró la reserva recién creada.');
      }

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findMyReservations(userId: number): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      where: { userId },
      relations: ['seats', 'showtime', 'showtime.movie', 'showtime.room'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      relations: ['seats', 'showtime', 'showtime.movie', 'showtime.room', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId?: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: userId ? { id, userId } : { id },
      relations: ['seats', 'showtime', 'showtime.movie', 'showtime.room'],
    });

    if (!reservation) {
      throw new NotFoundException('No se encontró la reserva.');
    }

    return reservation;
  }

  async cancel(id: number, userId: number): Promise<Reservation> {
    const reservation = await this.findOne(id, userId);

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('La reserva ya fue cancelada.');
    }

    reservation.status = ReservationStatus.CANCELLED;
    return this.reservationsRepository.save(reservation);
  }

  async getOccupiedSeats(showtimeId: number): Promise<ReservationSeat[]> {
    return this.reservationSeatsRepository.find({
      where: { showtimeId },
    });
  }
}