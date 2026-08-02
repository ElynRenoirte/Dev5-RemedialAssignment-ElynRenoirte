CREATE DATABASE IF NOT EXISTS neighborhood_watch CHARACTER SET utf8mb4;

USE neighborhood_watch;

-- Inhabitants who register sightings (data on individual user level, UID)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
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
-- All seed accounts use the password: password123
INSERT INTO users (name, email, password_hash) VALUES
    ('Elyn Renoirte', 'elyn@example.com', 'c9764cb4a7a0ea0dc9bd6ae2b3075130:c6ddbf52e96bece33d579ac0334a4bf4b6933443abc7a0be8a87f06e75b55799d2c867a7411d549c8072bc999e987c78213513e73a3b312341b6053b7d9f1bf9'),
    ('Jonas Peeters', 'jonas@example.com', 'cd38cf9234f3471b957e9cd8f59742c9:3aee072655964db456dd594f9c3cc912187f6eb2bae04e4debe0ca4075a862dda08117a471b310121c960107cd4b49f4b3879043367d2f98a0b95ec4192ad971'),
    ('Fatima Ait', 'fatima@example.com', '01df06b8b3e40a43cc7d1f20547f21ad:596bb1175a66f2a95c3c1aef692a8838a041a61dd2f68ed3f17ea82f3c5f264fc22e8fd156c5455f5e22ece3689e949c4d43ab56646c2d47bd4143cd1fca41b6');

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
