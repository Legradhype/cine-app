import api from '../api/axios';
import { Movie, MovieGenre } from '../types';

export interface CreateMoviePayload {
  title: string;
  synopsis: string;
  genre: MovieGenre;
  durationMinutes: number;
  ratingClassification: string;
}

export interface UpdateMoviePayload extends Partial<CreateMoviePayload> {}

export const moviesService = {
  async getAll(title?: string, genre?: MovieGenre): Promise<Movie[]> {
    const params: Record<string, string> = {};
    if (title) params.title = title;
    if (genre) params.genre = genre;
    const response = await api.get<Movie[]>('/movies', { params });
    return response.data;
  },

  async getById(id: string): Promise<Movie> {
    const response = await api.get<Movie>(`/movies/${id}`);
    return response.data;
  },

  async create(payload: CreateMoviePayload): Promise<Movie> {
    const response = await api.post<Movie>('/movies', payload);
    return response.data;
  },

  async update(id: string, payload: UpdateMoviePayload): Promise<Movie> {
    const response = await api.put<Movie>(`/movies/${id}`, payload);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/movies/${id}`);
  },

  async uploadPoster(id: string, file: File): Promise<Movie> {
    const formData = new FormData();
    formData.append('poster', file);
    const response = await api.patch<Movie>(`/movies/${id}/poster`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
