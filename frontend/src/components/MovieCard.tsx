import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const posterSrc = movie.posterUrl ? `http://localhost:3000${movie.posterUrl}` : null;

  return (
    <Link to={`/movies/${movie.id}`} className="text-decoration-none">
      <div className="movie-card fade-in-up">
        {posterSrc ? (
          <img
            src={posterSrc}
            alt={movie.title}
            className="movie-card-poster"
            loading="lazy"
          />
        ) : (
          <div className="movie-card-poster-placeholder">
            <i className="bi bi-camera-reels"></i>
          </div>
        )}
        <div className="movie-card-body">
          <h3 className="movie-card-title">{movie.title}</h3>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="movie-card-genre">{movie.genre}</span>
            <span className="movie-card-rating">{movie.ratingClassification}</span>
          </div>
          <p className="movie-card-duration mt-2">
            <i className="bi bi-clock me-1"></i>
            {movie.durationMinutes} min
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
