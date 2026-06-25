import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity('reservation_seats')
export class ReservationSeat {
  @PrimaryGeneratedColumn()
  id!: number; // Cambiado a number

  @ManyToOne(() => Reservation, (reservation) => reservation.seats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reservation_id' })
  reservation!: Reservation;

  @Column({ name: 'reservation_id', type: 'int' })
  reservationId!: number; // Cambiado a number

  @ManyToOne(() => Showtime, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'showtime_id' })
  showtime!: Showtime;

  @Column({ name: 'showtime_id', type: 'int' })
  showtimeId!: number; // Cambiado a number

  @Column({ name: 'row_index', type: 'int' })
  rowIndex!: number;

  @Column({ name: 'column_index', type: 'int' })
  columnIndex!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}