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
exports.ShowtimesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const showtime_entity_1 = require("./entities/showtime.entity");
const movies_service_1 = require("../movies/movies.service");
const rooms_service_1 = require("../rooms/rooms.service");
let ShowtimesService = class ShowtimesService {
    constructor(showtimesRepository, moviesService, roomsService) {
        this.showtimesRepository = showtimesRepository;
        this.moviesService = moviesService;
        this.roomsService = roomsService;
    }
    async checkOverlap(roomId, startTime, endTime, excludeId) {
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
            throw new common_1.ConflictException('Ya existe una función programada para esta sala en el horario seleccionado.');
        }
    }
    async create(createShowtimeDto) {
        await this.moviesService.findOne(createShowtimeDto.movieId);
        await this.roomsService.findOne(createShowtimeDto.roomId);
        const startTime = new Date(createShowtimeDto.startTime);
        const endTime = new Date(createShowtimeDto.endTime);
        if (endTime <= startTime) {
            throw new common_1.BadRequestException('La fecha y hora de fin debe ser posterior a la de inicio.');
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
    async findAll() {
        return this.showtimesRepository.find({
            relations: ['movie', 'room'],
            order: { startTime: 'ASC' },
        });
    }
    async findByMovie(movieId) {
        return this.showtimesRepository.find({
            where: { movieId },
            relations: ['room'],
            order: { startTime: 'ASC' },
        });
    }
    async findOne(id) {
        const showtime = await this.showtimesRepository.findOne({
            where: { id },
            relations: ['movie', 'room'],
        });
        if (!showtime) {
            throw new common_1.NotFoundException('La función no existe.');
        }
        return showtime;
    }
    async update(id, updateShowtimeDto) {
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
            throw new common_1.BadRequestException('La fecha y hora de fin debe ser posterior a la de inicio.');
        }
        await this.checkOverlap(roomId, startTime, endTime, id);
        Object.assign(showtime, {
            ...updateShowtimeDto,
            startTime,
            endTime,
        });
        return this.showtimesRepository.save(showtime);
    }
    async remove(id) {
        const showtime = await this.findOne(id);
        await this.showtimesRepository.remove(showtime);
    }
    async findOneWithRoom(id) {
        const showtime = await this.showtimesRepository.findOne({
            where: { id },
            relations: ['room', 'movie'],
        });
        if (!showtime) {
            throw new common_1.NotFoundException('La función no existe.');
        }
        return showtime;
    }
};
exports.ShowtimesService = ShowtimesService;
exports.ShowtimesService = ShowtimesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(showtime_entity_1.Showtime)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        movies_service_1.MoviesService,
        rooms_service_1.RoomsService])
], ShowtimesService);
//# sourceMappingURL=showtimes.service.js.map