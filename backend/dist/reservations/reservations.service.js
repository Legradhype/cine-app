"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("./entities/reservation.entity");
const reservation_seat_entity_1 = require("./entities/reservation-seat.entity");
const showtimes_service_1 = require("../showtimes/showtimes.service");
const reservation_status_enum_1 = require("./enums/reservation-status.enum");
let ReservationsService = class ReservationsService {
    constructor(reservationsRepository, reservationSeatsRepository, showtimesService, dataSource) {
        this.reservationsRepository = reservationsRepository;
        this.reservationSeatsRepository = reservationSeatsRepository;
        this.showtimesService = showtimesService;
        this.dataSource = dataSource;
    }
    async create(createReservationDto, user) {
        const showtime = await this.showtimesService.findOneWithRoom(createReservationDto.showtimeId);
        const room = showtime.room;
        for (const seat of createReservationDto.seats) {
            if (seat.rowIndex >= room.totalRows || seat.columnIndex >= room.totalColumns) {
                throw new common_1.BadRequestException(`El asiento fila ${seat.rowIndex}, columna ${seat.columnIndex} está fuera de los límites de la sala (${room.totalRows} filas x ${room.totalColumns} columnas).`);
            }
        }
        const uniqueSeats = new Set(createReservationDto.seats.map((s) => `${s.rowIndex}-${s.columnIndex}`));
        if (uniqueSeats.size !== createReservationDto.seats.length) {
            throw new common_1.BadRequestException('No puede seleccionar el mismo asiento más de una vez.');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const seat of createReservationDto.seats) {
                const existing = await queryRunner.manager.findOne(reservation_seat_entity_1.ReservationSeat, {
                    where: {
                        showtimeId: createReservationDto.showtimeId,
                        rowIndex: seat.rowIndex,
                        columnIndex: seat.columnIndex,
                    },
                    lock: { mode: 'pessimistic_write' },
                });
                if (existing) {
                    throw new common_1.ConflictException('Uno o más asientos seleccionados ya fueron reservados.');
                }
            }
            const priceAtPurchase = Number(showtime.price);
            const totalAmount = priceAtPurchase * createReservationDto.seats.length;
            const reservation = queryRunner.manager.create(reservation_entity_1.Reservation, {
                userId: user.id,
                showtimeId: createReservationDto.showtimeId,
                priceAtPurchase,
                totalAmount,
                status: reservation_status_enum_1.ReservationStatus.CONFIRMED,
            });
            const savedReservation = await queryRunner.manager.save(reservation_entity_1.Reservation, reservation);
            const reservationSeats = createReservationDto.seats.map((seat) => queryRunner.manager.create(reservation_seat_entity_1.ReservationSeat, {
                reservationId: savedReservation.id,
                showtimeId: createReservationDto.showtimeId,
                rowIndex: seat.rowIndex,
                columnIndex: seat.columnIndex,
            }));
            await queryRunner.manager.save(reservation_seat_entity_1.ReservationSeat, reservationSeats);
            await queryRunner.commitTransaction();
            const result = await this.reservationsRepository.findOne({
                where: { id: savedReservation.id },
                relations: ['seats', 'showtime', 'showtime.movie', 'showtime.room'],
            });
            if (!result) {
                throw new common_1.NotFoundException('No se encontró la reserva recién creada.');
            }
            return result;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findMyReservations(userId) {
        return this.reservationsRepository.find({
            where: { userId },
            relations: ['seats', 'showtime', 'showtime.movie', 'showtime.room'],
            order: { createdAt: 'DESC' },
        });
    }
    async findAll() {
        return this.reservationsRepository.find({
            relations: ['seats', 'showtime', 'showtime.movie', 'showtime.room', 'user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const reservation = await this.reservationsRepository.findOne({
            where: userId ? { id, userId } : { id },
            relations: ['seats', 'showtime', 'showtime.movie', 'showtime.room'],
        });
        if (!reservation) {
            throw new common_1.NotFoundException('No se encontró la reserva.');
        }
        return reservation;
    }
    async cancel(id, userId) {
        const reservation = await this.findOne(id, userId);
        if (reservation.status === reservation_status_enum_1.ReservationStatus.CANCELLED) {
            throw new common_1.BadRequestException('La reserva ya fue cancelada.');
        }
        reservation.status = reservation_status_enum_1.ReservationStatus.CANCELLED;
        return this.reservationsRepository.save(reservation);
    }
    async getOccupiedSeats(showtimeId) {
        return this.reservationSeatsRepository.find({
            where: { showtimeId },
        });
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(1, (0, typeorm_1.InjectRepository)(reservation_seat_entity_1.ReservationSeat)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        showtimes_service_1.ShowtimesService,
        typeorm_2.DataSource])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map