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
exports.Reservation = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const showtime_entity_1 = require("../../showtimes/entities/showtime.entity");
const reservation_seat_entity_1 = require("./reservation-seat.entity");
const reservation_status_enum_1 = require("../enums/reservation-status.enum");
let Reservation = class Reservation {
};
exports.Reservation = Reservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Reservation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'int' }),
    __metadata("design:type", Number)
], Reservation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => showtime_entity_1.Showtime, (showtime) => showtime.reservations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'showtime_id' }),
    __metadata("design:type", showtime_entity_1.Showtime)
], Reservation.prototype, "showtime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'showtime_id', type: 'int' }),
    __metadata("design:type", Number)
], Reservation.prototype, "showtimeId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'price_at_purchase',
        type: 'numeric',
        precision: 10,
        scale: 2,
    }),
    __metadata("design:type", Number)
], Reservation.prototype, "priceAtPurchase", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Reservation.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: reservation_status_enum_1.ReservationStatus.CONFIRMED,
    }),
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Reservation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Reservation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_seat_entity_1.ReservationSeat, (seat) => seat.reservation),
    __metadata("design:type", Array)
], Reservation.prototype, "seats", void 0);
exports.Reservation = Reservation = __decorate([
    (0, typeorm_1.Entity)('reservations')
], Reservation);
//# sourceMappingURL=reservation.entity.js.map