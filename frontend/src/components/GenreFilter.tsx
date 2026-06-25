import React from 'react';
import { MovieGenre } from '../types';

interface GenreFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ value, onChange }) => {
  const genres = Object.values(MovieGenre);

  return (
    <select
      className="form-select-cine form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      id="filter-genre"
      aria-label="Filtrar por género"
    >
      <option value="">Todos los géneros</option>
      {genres.map((genre) => (
        <option key={genre} value={genre}>
          {genre}
        </option>
      ))}
    </select>
  );
};

export default GenreFilter;
