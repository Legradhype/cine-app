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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Showtime = void 0;
const typeorm_1 = require("typeorm");
const movie_entity_1 = require("../../movies/entities/movie.entity");
const room_entity_1 = require("../../rooms/entities/room.entity");
const reservation_entity_1 = require("../../reservations/entities/reservation.entity");
const showtime_status_enum_1 = require("../enums/showtime-status.enum");
let Showtime = class Showtime {
};
exports.Showtime = Showtime;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Showtime.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => movie_entity_1.Movie, (movie) => movie.showtimes, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'movie_id' }),
    __metadata("design:type", movie_entity_1.Movie)
], Showtime.prototype, "movie", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'movie_id', type: 'int' }),
    __metadata("design:type", Number)
], Showtime.prototype, "movieId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, (room) => room.showtimes, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'room_id' }),
    __metadata("design:type", room_entity_1.Room)
], Showtime.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_id', type: 'int' }),
    __metadata("design:type", Number)
], Showtime.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time', type: 'timestamp' }),
    __metadata("design:type", Date)
], Showtime.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', type: 'timestamp' }),
    __metadata("design:type", Date)
], Showtime.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Showtime.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: showtime_status_enum_1.ShowtimeStatus.SCHEDULED,
    }),
    __metadata("design:type", String)
], Showtime.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Showtime.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Showtime.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.showtime),
    __metadata("design:type", Array)
], Showtime.prototype, "reservations", void 0);
exports.Showtime = Showtime = __decorate([
    (0, typeorm_1.Entity)('showtimes')
], Showtime);
//# sourceMappingURL=showtime.entity.js.map