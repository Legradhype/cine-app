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
exports.UpdateMovieDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const movie_genre_enum_1 = require("../enums/movie-genre.enum");
const rating_classification_enum_1 = require("../enums/rating-classification.enum");
class UpdateMovieDto {
}
exports.UpdateMovieDto = UpdateMovieDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'El Señor de los Anillos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El título debe ser texto.' }),
    (0, class_validator_1.Length)(1, 255, { message: 'El título debe tener entre 1 y 255 caracteres.' }),
    __metadata("design:type", String)
], UpdateMovieDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La sinopsis debe ser texto.' }),
    (0, class_validator_1.Length)(1, 5000),
    __metadata("design:type", String)
], UpdateMovieDto.prototype, "synopsis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: movie_genre_enum_1.MovieGenre }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(movie_genre_enum_1.MovieGenre, { message: 'El género seleccionado no es válido.' }),
    __metadata("design:type", String)
], UpdateMovieDto.prototype, "genre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 120 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'La duración debe ser un número entero.' }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(600),
    __metadata("design:type", Number)
], UpdateMovieDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: rating_classification_enum_1.RatingClassification }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(rating_classification_enum_1.RatingClassification, { message: 'La clasificación seleccionada no es válida.' }),
    __metadata("design:type", String)
], UpdateMovieDto.prototype, "ratingClassification", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMovieDto.prototype, "posterUrl", void 0);
//# sourceMappingURL=update-movie.dto.js.map