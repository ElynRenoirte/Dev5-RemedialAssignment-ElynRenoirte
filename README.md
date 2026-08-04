# Neighborhood Watch App

This web application simulates surveillance in a neighborhood. By filling in a report form users can report sightings of suspicious persons, strangers, known neighbors etc. They can fill in a description and by clicking on a location on the map they can also add the exact location they saw the person at. There are also statistics about the most active user, most reported categories and the most reported persons & areas. Users must also login, this creates a UID so that users are distinguishable. The user and what they filled in get added to the database and the data influences the user-facing part of the project.

## Features

- Database
- Login system
- Report system (form)
- Interactive map (with Leaflet)
- Statistics (visualization of the data)
- A UID gets assigned everytime a user starts logs in, each user is stored in a database
- Distinguishable users

## Tech stack

- Backend: Node.js, Express
- Frontend: Javascript, HTML, CSS
- Database: MySQL
- Map: Leaflet

## Quick start

### Prerequisites

- Node.js (18+ recommended)
- npm
- Docker

1. Clone the Git repository.

2. Copy the `.env.template` file to `.env`:

```
cp .env.template .env
```

3. To start all services run:

```
docker compose up --build
```

The frontend will be available at http://localhost:8080 and the backend at http://localhost:3000.

3. log in with your name and use a random password (not one you already use)

4. Once logged in you can fill in the form. For the location you can just click on the map, you don't need to write a longitude and a latitude yourself.

5. When you click on submit report, what you filled in gets added to the database with your UID. It then gets added to the statistics under the map.

## API endpoints

The backend runs at http://localhost:3000.

### Users

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| GET    | `/api/users`             | Get all users                   |
| GET    | `/api/users/:id`         | Get a single user by id         |
| GET    | `/api/users/:id/reports` | Get all reports of a user       |
| POST   | `/api/users`             | Create a user                   |
| POST   | `/api/users/login`       | Log in with a name and password |

`POST /api/users` body: `{ "name": "John Doe", "email": "john@example.com" }` (email optional)

`POST /api/users/login` body: `{ "name": "John Doe", "password": "yourpassword" }`

### Reports

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| GET    | `/api/reports`       | Get all reports                  |
| GET    | `/api/reports/:id`   | Get a single report by id        |
| GET    | `/api/reports/stats` | Get statistics about the reports |
| POST   | `/api/reports`       | Create a new report              |

`POST /api/reports` body:

```
{
  "userId": 1,
  "categoryId": 2,
  "personName": "Woman with red bike",
  "description": "Circling the block twice.",
  "latitude": 51.049,
  "longitude": 3.715,
  "direction": "W"
}
```

### Persons

| Method | Endpoint                      | Description                                |
| ------ | ----------------------------- | ------------------------------------------ |
| GET    | `/api/persons`                | Get all persons                            |
| GET    | `/api/persons/:id`            | Get a single person by id                  |
| GET    | `/api/persons/:id/trajectory` | Get the trajectory (sightings) of a person |
| POST   | `/api/persons`                | Create a person                            |

`POST /api/persons` body: `{ "name": "Man in blue jacket" }`

### Categories

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | `/api/categories` | Get all categories |
| POST   | `/api/categories` | Create a category  |

`POST /api/categories` body: `{ "name": "suspicious" }`

### Other

| Method | Endpoint  | Description                                   |
| ------ | --------- | --------------------------------------------- |
| GET    | `/`       | API info                                      |
| GET    | `/health` | Health check (checks the database connection) |

## License

This project is licensed under the MIT License. See LICENSE file.

## References

- Videos on canvas to understand Docker and Open Sourcing
- Opencode ai chat to help with code, fix bugs and explain code (for example login page and report system): https://opncd.ai/share/SAzxWv7d
- Leaflet for the interactive map: https://leafletjs.com/
- Semantic versioning for changelog: https://semver.org/
- Help with readme: https://www.markdownguide.org/basic-syntax/
