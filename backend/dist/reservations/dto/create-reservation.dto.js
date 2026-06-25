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
exports.CreateReservationDto = exports.SeatDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class SeatDto {
}
exports.SeatDto = SeatDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Índice de fila (base 0)' }),
    (0, class_validator_1.IsInt)({ message: 'El índice de fila debe ser un número entero.' }),
    (0, class_validator_1.Min)(0, { message: 'El índice de fila no puede ser negativo.' }),
    __metadata("design:type", Number)
], SeatDto.prototype, "rowIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Índice de columna (base 0)' }),
    (0, class_validator_1.IsInt)({ message: 'El índice de columna debe ser un número entero.' }),
    (0, class_validator_1.Min)(0, { message: 'El índice de columna no puede ser negativo.' }),
    __metadata("design:type", Number)
], SeatDto.prototype, "columnIndex", void 0);
class CreateReservationDto {
}
exports.CreateReservationDto = CreateReservationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID de la función' }),
    (0, class_validator_1.IsInt)({ message: 'El ID de la función debe ser un número entero.' }),
    __metadata("design:type", Number)
], CreateReservationDto.prototype, "showtimeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SeatDto], description: 'Asientos a reservar' }),
    (0, class_validator_1.IsArray)({ message: 'Los asientos deben ser un arreglo.' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Debe seleccionar al menos un asiento.' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SeatDto),
    __metadata("design:type", Array)
], CreateReservationDto.prototype, "seats", void 0);
//# sourceMappingURL=create-reservation.dto.js.map