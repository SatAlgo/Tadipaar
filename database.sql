-- 1. Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) UNIQUE NOT NULL, -- Replaced username with mobile number
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'criminal' -- 'criminal' or 'officer'
);

-- 2. Create Check-ins Table
CREATE TABLE check_ins (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    image_url TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Boundaries Table (For tracking Tadipaar zones)
CREATE TABLE boundaries (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    center_lat DECIMAL(10, 8),
    center_long DECIMAL(11, 8),
    radius_km DECIMAL(5, 2)
);