import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MovieGenre } from '../enums/movie-genre.enum';
import { RatingClassification } from '../enums/rating-classification.enum';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  synopsis!: string;
  @Column({ type: 'varchar', length: 100 })
  genre!: MovieGenre;

  @Column({ name: 'duration_minutes', type: 'int' })
  durationMinutes!: number;

  @Column({
    name: 'rating_classification',
    type: 'varchar',
    length: 20,
  })
  ratingClassification!: RatingClassification;

  @Column({ name: 'poster_url', type: 'varchar', length: 500, nullable: true })
  posterUrl!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes!: Showtime[];
}