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
exports.CreateMovieDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const movie_genre_enum_1 = require("../enums/movie-genre.enum");
const rating_classification_enum_1 = require("../enums/rating-classification.enum");
class CreateMovieDto {
}
exports.CreateMovieDto = CreateMovieDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'El Señor de los Anillos', description: 'Título de la película' }),
    (0, class_validator_1.IsString)({ message: 'El título debe ser texto.' }),
    (0, class_validator_1.Length)(1, 255, { message: 'El título debe tener entre 1 y 255 caracteres.' }),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sinopsis de la película' }),
    (0, class_validator_1.IsString)({ message: 'La sinopsis debe ser texto.' }),
    (0, class_validator_1.Length)(1, 5000, { message: 'La sinopsis debe tener entre 1 y 5000 caracteres.' }),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "synopsis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: movie_genre_enum_1.MovieGenre, description: 'Género de la película' }),
    (0, class_validator_1.IsEnum)(movie_genre_enum_1.MovieGenre, { message: 'El género seleccionado no es válido.' }),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "genre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120, description: 'Duración en minutos' }),
    (0, class_validator_1.IsInt)({ message: 'La duración debe ser un número entero.' }),
    (0, class_validator_1.Min)(1, { message: 'La duración mínima es 1 minuto.' }),
    (0, class_validator_1.Max)(600, { message: 'La duración máxima es 600 minutos.' }),
    __metadata("design:type", Number)
], CreateMovieDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: rating_classification_enum_1.RatingClassification, description: 'Clasificación de la película' }),
    (0, class_validator_1.IsEnum)(rating_classification_enum_1.RatingClassification, { message: 'La clasificación seleccionada no es válida.' }),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "ratingClassification", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL del poster (se establece al subir imagen)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "posterUrl", void 0);
//# sourceMappingURL=create-movie.dto.js.map