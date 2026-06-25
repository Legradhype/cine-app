-- ==========================================
-- USERS
-- ==========================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('ADMIN', 'CLIENT')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- MOVIES
-- ==========================================

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    synopsis TEXT NOT NULL,

    genre VARCHAR(100) NOT NULL,

    duration_minutes INTEGER NOT NULL
        CHECK (duration_minutes > 0),

    rating_classification VARCHAR(20) NOT NULL,

    poster_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ROOMS
-- ==========================================

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    total_rows INTEGER NOT NULL
        CHECK (total_rows > 0),

    total_columns INTEGER NOT NULL
        CHECK (total_columns > 0),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SHOWTIMES
-- ==========================================

CREATE TABLE showtimes (
    id SERIAL PRIMARY KEY,

    movie_id INTEGER NOT NULL,

    room_id INTEGER NOT NULL,

    start_time TIMESTAMP NOT NULL,

    end_time TIMESTAMP NOT NULL,

    price NUMERIC(10,2) NOT NULL
        CHECK (price >= 0),

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (
            status IN (
                'ACTIVE',
                'CANCELLED',
                'FINISHED'
            )
        ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_showtime_movie
        FOREIGN KEY (movie_id)
        REFERENCES movies(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_showtime_room
        FOREIGN KEY (room_id)
        REFERENCES rooms(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_showtime_dates
        CHECK (end_time > start_time)
);

-- ==========================================
-- RESERVATIONS
-- ==========================================

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    showtime_id INTEGER NOT NULL,

    price_at_purchase NUMERIC(10,2) NOT NULL
        CHECK (price_at_purchase >= 0),

    total_amount NUMERIC(10,2) NOT NULL
        CHECK (total_amount >= 0),

    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED'
        CHECK (
            status IN (
                'PENDING',
                'CONFIRMED',
                'CANCELLED'
            )
        ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reservation_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reservation_showtime
        FOREIGN KEY (showtime_id)
        REFERENCES showtimes(id)
        ON DELETE CASCADE
);

-- ==========================================
-- RESERVATION_SEATS
-- ==========================================

CREATE TABLE reservation_seats (
    id SERIAL PRIMARY KEY,

    reservation_id INTEGER NOT NULL,

    showtime_id INTEGER NOT NULL,

    row_index INTEGER NOT NULL
        CHECK (row_index > 0),

    column_index INTEGER NOT NULL
        CHECK (column_index > 0),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reservation_seat_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES reservations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reservation_seat_showtime
        FOREIGN KEY (showtime_id)
        REFERENCES showtimes(id)
        ON DELETE CASCADE
);

-- ==========================================
-- UNIQUE CONSTRAINT
-- EVITA RESERVAR EL MISMO ASIENTO
-- DOS VECES EN LA MISMA FUNCIÓN
-- ==========================================

ALTER TABLE reservation_seats
ADD CONSTRAINT uq_showtime_seat
UNIQUE (
    showtime_id,
    row_index,
    column_index
);

-- ==========================================
-- ÍNDICES
-- ==========================================

CREATE INDEX idx_movies_title
ON movies(title);

CREATE INDEX idx_movies_genre
ON movies(genre);

CREATE INDEX idx_showtimes_movie
ON showtimes(movie_id);

CREATE INDEX idx_showtimes_room
ON showtimes(room_id);

CREATE INDEX idx_reservations_user
ON reservations(user_id);

CREATE INDEX idx_reservations_showtime
ON reservations(showtime_id);

CREATE INDEX idx_reservation_seats_showtime
ON reservation_seats(showtime_id);



INSERT INTO users (email, password_hash, role, created_at, updated_at)
VALUES (
    'admin@cine.com', 
    '$2b$10$e.wS4nK3JvYv9FwV3D/vOuoE2w6k0i8L7p4S/M.x3N.y3L.q4J9Oq', -- Este es el hash de 'Admin123!'
    'ADMIN', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
);

SELECT email, role FROM users;

UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'admin@cine.com';





TRUNCATE TABLE users CASCADE