CREATE DATABASE IF NOT EXISTS neighborhood_watch CHARACTER SET utf8mb4;

USE neighborhood_watch;

-- Inhabitants who register sightings (data on individual user level, UID)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fixed list of categories a sighting can belong to
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Observed people whose movement is tracked (used to build trajectories)
CREATE TABLE persons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- A single sighting ("viewing") of a person, reported by a user
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    person_id INT,
    description TEXT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    direction VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (person_id) REFERENCES persons(id)
);

-- Seed data so the app is immediately usable (map + trajectories)
INSERT INTO users (name, email) VALUES
    ('Elyn Renoirte', 'elyn@example.com'),
    ('Jonas Peeters', 'jonas@example.com'),
    ('Fatima Ait', 'fatima@example.com');

INSERT INTO categories (name) VALUES
    ('stranger'),
    ('thief'),
    ('missing person'),
    ('suspicious'),
    ('known neighbor');

INSERT INTO persons (name) VALUES
    ('Man in blue jacket'),
    ('Woman with red bike'),
    ('Boy with grey hoodie');

-- Three sightings of "Man in blue jacket" at different times/locations = trajectory
INSERT INTO reports (user_id, category_id, person_id, description, latitude, longitude, direction, created_at) VALUES
    (1, 4, 1, 'Unknown man walking fast between the parked cars, looking around.', 51.0510, 3.7180, 'NE', '2026-07-30 08:12:00'),
    (2, 4, 1, 'Same blue jacket man, now crossing the market square.', 51.0520, 3.7200, 'NE', '2026-07-30 08:20:00'),
    (1, 4, 1, 'Still walking, passed the bakery and turned onto the Kouter.', 51.0540, 3.7230, 'E', '2026-07-30 08:33:00'),
    (3, 2, 2, 'Woman on a red bike circling the same block twice.', 51.0490, 3.7150, 'W', '2026-07-30 09:02:00'),
    (3, 3, 3, 'Boy in a grey hoodie waiting alone in front of the school gate.', 51.0560, 3.7300, 'S', '2026-07-30 15:40:00'),
    (2, 1, 2, 'Red bike parked at the station, no sign of the rider.', 51.0420, 3.7100, 'N', '2026-07-30 17:15:00');
