import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { User } from '../users/entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { ReservationSeat } from './entities/reservation-seat.entity';

@ApiTags('Reservas')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear reserva (usuario autenticado)' })
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: User,
  ): Promise<Reservation> {
    return this.reservationsService.create(createReservationDto, user);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mis reservas (usuario autenticado)' })
  async findMyReservations(@CurrentUser() user: User): Promise<Reservation[]> {
    return this.reservationsService.findMyReservations(Number(user.id));
  }

  @Get('showtime/:showtimeId/seats')
  @ApiOperation({ summary: 'Asientos ocupados de una función (público)' })
  async getOccupiedSeats(
    @Param('showtimeId', ParseIntPipe) showtimeId: number,
  ): Promise<ReservationSeat[]> {
    return this.reservationsService.getOccupiedSeats(showtimeId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todas las reservas (Solo ADMIN)' })
  async findAll(): Promise<Reservation[]> {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Detalle de reserva propia' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Reservation> {
    const userId = user.role === UserRole.ADMIN ? undefined : Number(user.id);
    return this.reservationsService.findOne(id, userId);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cancelar reserva propia' })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Reservation> {
    return this.reservationsService.cancel(id, Number(user.id));
  }
}