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
exports.UpdateShowtimeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const showtime_status_enum_1 = require("../enums/showtime-status.enum");
class UpdateShowtimeDto {
}
exports.UpdateShowtimeDto = UpdateShowtimeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'El ID de la película debe ser un número entero.' }),
    __metadata("design:type", Number)
], UpdateShowtimeDto.prototype, "movieId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'El ID de la sala debe ser un número entero.' }),
    __metadata("design:type", Number)
], UpdateShowtimeDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de inicio no es válida.' }),
    __metadata("design:type", String)
], UpdateShowtimeDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de fin no es válida.' }),
    __metadata("design:type", String)
], UpdateShowtimeDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'El precio debe ser un número.' }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateShowtimeDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: showtime_status_enum_1.ShowtimeStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(showtime_status_enum_1.ShowtimeStatus, { message: 'El estado de la función no es válido.' }),
    __metadata("design:type", String)
], UpdateShowtimeDto.prototype, "status", void 0);
//# sourceMappingURL=update-showtime.dto.js.map