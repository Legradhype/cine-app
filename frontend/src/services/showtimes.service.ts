import api from '../api/axios';
import { Showtime, ShowtimeStatus } from '../types';

export interface CreateShowtimePayload {
  movieId: number;
  roomId: number;
  startTime: string;
  endTime: string;
  price: number;
  status?: ShowtimeStatus;
}

export interface UpdateShowtimePayload extends Partial<CreateShowtimePayload> {}

export const showtimesService = {
  async getAll(): Promise<Showtime[]> {
    const response = await api.get<Showtime[]>('/showtimes');
    return response.data;
  },

 async getById(id: number): Promise<Showtime> {
    const response = await api.get<Showtime>(`/showtimes/${id}`);
    return response.data;
  },

async create(payload: CreateShowtimePayload): Promise<Showtime> {
    const response = await api.post<Showtime>('/showtimes', payload);
    return response.data;
  },

async update(id: number, payload: UpdateShowtimePayload): Promise<Showtime> {
    const response = await api.put<Showtime>(`/showtimes/${id}`, payload);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/showtimes/${id}`);
  },
};
