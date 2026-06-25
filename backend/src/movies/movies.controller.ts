import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { Movie } from './entities/movie.entity';
import { MovieGenre } from './enums/movie-genre.enum';

@ApiTags('Películas')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear película (Solo ADMIN)' })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar películas (público). Permite filtrar por título y género.' })
  @ApiQuery({ name: 'title', required: false, description: 'Buscar por título' })
  @ApiQuery({ name: 'genre', required: false, enum: MovieGenre, description: 'Filtrar por género' })
  async findAll(
    @Query('title') title?: string,
    @Query('genre') genre?: MovieGenre,
  ): Promise<Movie[]> {
    return this.moviesService.findAll(title, genre);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de película con funciones (público)' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    return this.moviesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar película (Solo ADMIN)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar película (Solo ADMIN)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.moviesService.remove(id);
    return { message: 'Película eliminada exitosamente.' };
  }

  @Patch(':id/poster')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Subir o reemplazar poster de película (Solo ADMIN)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `poster-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const isValid = allowedTypes.test(extname(file.originalname).toLowerCase()) &&
          allowedTypes.test(file.mimetype);
        if (isValid) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Solo se permiten imágenes (jpeg, jpg, png, gif, webp).'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadPoster(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Movie> {
    if (!file) {
      throw new BadRequestException('No se adjuntó ningún archivo.');
    }
    const posterUrl = `/uploads/posters/${file.filename}`;
    return this.moviesService.updatePoster(id, posterUrl);
  }
}