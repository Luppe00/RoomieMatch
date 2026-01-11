-- Schema for RoomieMatch
-- Dropping tables if they exist to allow clean re-runs
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS swipes;
DROP TABLE IF EXISTS preferences;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

-- 3.1 Table: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    email TEXT UNIQUE NOT NULL,
    profile_image TEXT,
    bio TEXT,
    user_type TEXT NOT NULL CHECK (user_type IN ('HAS_ROOM', 'NEEDS_ROOM')),
    password_hash BYTEA,
    password_salt BYTEA,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3.2 Table: rooms
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    rent NUMERIC NOT NULL,
    size_sqm INTEGER,
    room_image TEXT,
    room_images TEXT[],
    description TEXT,
    available_from DATE
);

-- 3.3 Table: preferences
CREATE TABLE preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    max_rent NUMERIC,
    preferred_location TEXT,
    preferred_gender TEXT CHECK (preferred_gender IN ('Male', 'Female', 'Other', 'Any')),
    min_age_roomie INTEGER,
    max_age_roomie INTEGER,
    preferred_locations TEXT,
    rent_period VARCHAR(50),
    smoker_preference VARCHAR(50)
);

-- 3.4 Table: swipes
CREATE TABLE swipes (
    id SERIAL PRIMARY KEY,
    swiper_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    liked BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(swiper_user_id, target_user_id)
);

-- Indexes for swipes to optimize lookup
CREATE INDEX idx_swipes_swiper ON swipes(swiper_user_id);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    date_sent TIMESTAMP DEFAULT NOW(),
    date_read TIMESTAMP NULL
);
CREATE INDEX idx_swipes_target ON swipes(target_user_id);

-- 3.5 Table: matches
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    user_a_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_b_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraint to ensure unique match pair and ordered ids (smallest first)
    CONSTRAINT unique_match_pair UNIQUE (user_a_id, user_b_id),
    CONSTRAINT check_ordered_pair CHECK (user_a_id < user_b_id)
);
