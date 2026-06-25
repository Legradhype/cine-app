import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { ShowtimeStatus } from '../enums/showtime-status.enum';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'movie_id' })
  movie!: Movie;
  @Column({ name: 'movie_id', type: 'int' })
  movieId!: number;

  @ManyToOne(() => Room, (room) => room.showtimes, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'room_id' })
  room!: Room;


  @Column({ name: 'room_id', type: 'int' })
  roomId!: number;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime!: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime!: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: number;

  // Alineado con el VARCHAR(20) de tu script SQL
  @Column({
    type: 'varchar',
    length: 20,
    default: ShowtimeStatus.SCHEDULED,
  })
  status!: ShowtimeStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.showtime)
  reservations!: Reservation[];
}