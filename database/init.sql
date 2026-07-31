CREATE TABLE users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100),

    email VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


);

CREATE TABLE reports (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    description TEXT,

    latitude DOUBLE,

    longitude DOUBLE,

    direction VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(id)

);