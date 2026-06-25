import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieGenre } from './enums/movie-genre.enum';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(movie);
  }

  async findAll(title?: string, genre?: MovieGenre): Promise<Movie[]> {
    const queryBuilder = this.moviesRepository.createQueryBuilder('movie');

    if (title) {
      queryBuilder.andWhere('LOWER(movie.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }

    if (genre) {
      queryBuilder.andWhere('movie.genre = :genre', { genre });
    }

    queryBuilder.orderBy('movie.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['showtimes', 'showtimes.room'],
    });

    if (!movie) {
      throw new NotFoundException('La película no existe.');
    }

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    Object.assign(movie, updateMovieDto);
    return this.moviesRepository.save(movie);
  }


  async updatePoster(id: number, posterUrl: string): Promise<Movie> {
    const movie = await this.findOne(id);
    movie.posterUrl = posterUrl;
    return this.moviesRepository.save(movie);
  }


  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    await this.moviesRepository.remove(movie);
  }
}