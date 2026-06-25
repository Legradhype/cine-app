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
exports.ReservationSeat = void 0;
const typeorm_1 = require("typeorm");
const reservation_entity_1 = require("./reservation.entity");
const showtime_entity_1 = require("../../showtimes/entities/showtime.entity");
let ReservationSeat = class ReservationSeat {
};
exports.ReservationSeat = ReservationSeat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReservationSeat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reservation_entity_1.Reservation, (reservation) => reservation.seats, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'reservation_id' }),
    __metadata("design:type", reservation_entity_1.Reservation)
], ReservationSeat.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reservation_id', type: 'int' }),
    __metadata("design:type", Number)
], ReservationSeat.prototype, "reservationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => showtime_entity_1.Showtime, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'showtime_id' }),
    __metadata("design:type", showtime_entity_1.Showtime)
], ReservationSeat.prototype, "showtime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'showtime_id', type: 'int' }),
    __metadata("design:type", Number)
], ReservationSeat.prototype, "showtimeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'row_index', type: 'int' }),
    __metadata("design:type", Number)
], ReservationSeat.prototype, "rowIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'column_index', type: 'int' }),
    __metadata("design:type", Number)
], ReservationSeat.prototype, "columnIndex", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ReservationSeat.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ReservationSeat.prototype, "updatedAt", void 0);
exports.ReservationSeat = ReservationSeat = __decorate([
    (0, typeorm_1.Entity)('reservation_seats')
], ReservationSeat);
//# sourceMappingURL=reservation-seat.entity.js.map