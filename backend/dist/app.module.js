"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const movies_module_1 = require("./movies/movies.module");
const rooms_module_1 = require("./rooms/rooms.module");
const showtimes_module_1 = require("./showtimes/showtimes.module");
const reservations_module_1 = require("./reservations/reservations.module");
const common_module_1 = require("./common/common.module");
const user_entity_1 = require("./users/entities/user.entity");
const movie_entity_1 = require("./movies/entities/movie.entity");
const room_entity_1 = require("./rooms/entities/room.entity");
const showtime_entity_1 = require("./showtimes/entities/showtime.entity");
const reservation_entity_1 = require("./reservations/entities/reservation.entity");
const reservation_seat_entity_1 = require("./reservations/entities/reservation-seat.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'postgres'),
                    database: configService.get('DB_DATABASE', 'cine_db'),
                    entities: [user_entity_1.User, movie_entity_1.Movie, room_entity_1.Room, showtime_entity_1.Showtime, reservation_entity_1.Reservation, reservation_seat_entity_1.ReservationSeat],
                    synchronize: true,
                    logging: false,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            movies_module_1.MoviesModule,
            rooms_module_1.RoomsModule,
            showtimes_module_1.ShowtimesModule,
            reservations_module_1.ReservationsModule,
            common_module_1.CommonModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map