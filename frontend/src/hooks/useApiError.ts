import { AxiosError } from 'axios';
import { ApiError } from '../types';

export function useApiError() {
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as AxiosError<ApiError>;
      const data = axiosError.response?.data;

      if (data?.message) {
        if (Array.isArray(data.message)) {
          return data.message.join('. ');
        }
        return data.message;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Ocurrió un error inesperado.';
  };

  return { getErrorMessage };
}
