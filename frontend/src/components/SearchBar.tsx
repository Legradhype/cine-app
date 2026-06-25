import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar películas...',
}) => {
  return (
    <div className="position-relative">
      <i
        className="bi bi-search position-absolute"
        style={{
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-muted)',
          pointerEvents: 'none',
        }}
      ></i>
      <input
        type="text"
        className="form-control-cine form-control"
        style={{ paddingLeft: '2.5rem' }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id="search-movies"
      />
    </div>
  );
};

export default SearchBar;
