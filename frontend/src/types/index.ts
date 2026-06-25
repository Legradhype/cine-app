export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export enum MovieGenre {
  ACCION = 'Acción',
  AVENTURA = 'Aventura',
  ANIMACION = 'Animación',
  COMEDIA = 'Comedia',
  CRIMEN = 'Crimen',
  DOCUMENTAL = 'Documental',
  DRAMA = 'Drama',
  FANTASIA = 'Fantasía',
  TERROR = 'Terror',
  MUSICAL = 'Musical',
  MISTERIO = 'Misterio',
  ROMANCE = 'Romance',
  CIENCIA_FICCION = 'Ciencia Ficción',
  SUSPENSO = 'Suspenso',
  WESTERN = 'Western',
}

export enum RatingClassification {
  G = 'G',
  PG = 'PG',
  PG13 = 'PG-13',
  R = 'R',
  NC17 = 'NC-17',
  ATP = 'ATP',
  B = 'B',
  B15 = 'B-15',
  C = 'C',
  D = 'D',
}

export enum ShowtimeStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

export interface User {
  id: number; // Cambiado a number
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Movie {
  id: number; // Cambiado a number
  title: string;
  synopsis: string;
  genre: MovieGenre;
  durationMinutes: number;
  ratingClassification: RatingClassification;
  posterUrl: string | null;
  createdAt: string;
  updatedAt: string;
  showtimes?: Showtime[];
}

export interface Room {
  id: number; // Cambiado a number
  name: string;
  totalRows: number;
  totalColumns: number;
  createdAt: string;
  updatedAt: string;
}

export interface Showtime {
  id: number; // Cambiado a number
  movieId: number; // Cambiado a number
  roomId: number; // Cambiado a number
  movie?: Movie;
  room?: Room;
  startTime: string;
  endTime: string;
  price: number;
  status: ShowtimeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationSeat {
  id: number; // Cambiado a number
  reservationId: number; // Cambiado a number
  showtimeId: number; // Cambiado a number
  rowIndex: number;
  columnIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: number; // Cambiado a number
  userId: number; // Cambiado a number
  showtimeId: number; // Cambiado a number
  showtime?: Showtime;
  seats: ReservationSeat[];
  priceAtPurchase: number;
  totalAmount: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SeatPosition {
  rowIndex: number;
  columnIndex: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}