import api from '../api/axios';
import { Reservation, ReservationSeat, SeatPosition } from '../types';

export interface CreateReservationPayload {
  showtimeId: string;
  seats: SeatPosition[];
}

export const reservationsService = {
  async create(payload: CreateReservationPayload): Promise<Reservation> {
    const response = await api.post<Reservation>('/reservations', payload);
    return response.data;
  },

  async getMyReservations(): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>('/reservations/my');
    return response.data;
  },

  async getOccupiedSeats(showtimeId: string): Promise<ReservationSeat[]> {
    const response = await api.get<ReservationSeat[]>(
      `/reservations/showtime/${showtimeId}/seats`,
    );
    return response.data;
  },

 cancel: async (id: number) => {
    const response = await api.patch(`/reservations/${id}/cancel`);
    return response.data;
  },

  async getById(id: string): Promise<Reservation> {
    const response = await api.get<Reservation>(`/reservations/${id}`);
    return response.data;
  },
};
