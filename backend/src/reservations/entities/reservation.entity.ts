import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';
import { ReservationSeat } from './reservation-seat.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number; // Cambiado a number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number; // Cambiado a number

  @ManyToOne(() => Showtime, (showtime) => showtime.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'showtime_id' })
  showtime!: Showtime;

  @Column({ name: 'showtime_id', type: 'int' })
  showtimeId!: number; // Cambiado a number

  @Column({
    name: 'price_at_purchase',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  priceAtPurchase!: number;

  @Column({ name: 'total_amount', type: 'numeric', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: ReservationStatus.CONFIRMED,
  })
  status!: ReservationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => ReservationSeat, (seat) => seat.reservation)
  seats!: ReservationSeat[];
}