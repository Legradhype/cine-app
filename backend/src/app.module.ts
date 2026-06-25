import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { RoomsModule } from './rooms/rooms.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { ReservationsModule } from './reservations/reservations.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { Movie } from './movies/entities/movie.entity';
import { Room } from './rooms/entities/room.entity';
import { Showtime } from './showtimes/entities/showtime.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { ReservationSeat } from './reservations/entities/reservation-seat.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'cine_db'),
        entities: [User, Movie, Room, Showtime, Reservation, ReservationSeat],
        synchronize: true,
        logging: false,
      }),
    }),
    AuthModule,
    UsersModule,
    MoviesModule,
    RoomsModule,
    ShowtimesModule,
    ReservationsModule,
    CommonModule,
  ],
})
export class AppModule {}
