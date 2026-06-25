import api from '../api/axios';
import { Room } from '../types';

export interface CreateRoomPayload {
  name: string;
  totalRows: number;
  totalColumns: number;
}

export interface UpdateRoomPayload extends Partial<CreateRoomPayload> {}

export const roomsService = {
  async getAll(): Promise<Room[]> {
    const response = await api.get<Room[]>('/rooms');
    return response.data;
  },

async getById(id: number): Promise<Room> {
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  async create(payload: CreateRoomPayload): Promise<Room> {
    const response = await api.post<Room>('/rooms', payload);
    return response.data;
  },

async update(id: number, payload: Partial<Room>): Promise<Room> {
    const response = await api.put<Room>(`/rooms/${id}`, payload);
    return response.data;
  },
 async delete(id: number): Promise<void> {
    await api.delete(`/rooms/${id}`);
  },
};
