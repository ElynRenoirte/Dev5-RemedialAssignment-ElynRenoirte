# Contributing Guidelines

Thank you for your interest in contributing to the Neighborhood Watch App!
This document provides guidelines and instructions for contributing to this project.

## Getting Started

### Prerequisites

Before running the project, make sure you have installed:

* Docker Desktop
* Git
* Visual Studio Code (recommended)

### Running the Project

1. Clone the repository.
2. Create a `.env` file based on `.env.template`.
3. Open the project in Visual Studio Code.
4. Start the application:

```bash
docker compose up --build
```

The application will start running the frontend, backend, and MySQL database.

## Branching Strategy

Please create a new branch for each feature or bug fix.

Examples:

* `feature/user-system`
* `feature/report-system`
* `feature/map`
* `bugfix/database-connection`

Do not commit directly to the `main` branch.

## Commit Messages

Write short, descriptive commit messages.

Examples:

* Add user registration endpoint
* Implement report validation
* Create reports database table
* Fix MySQL connection issue
* Created map with leaflet

Avoid commit messages such as:

* Update
* Changes
* Fix stuff

## Coding Guidelines

Please follow these conventions:

* Use meaningful variable and function names.
* Keep code modular and reusable.
* Follow the Single Responsibility Principle where possible.
* Validate user input before storing data.
* Keep formatting consistent throughout the project.
* Add comments only where they improve understanding.

## Testing

Before committing changes:

* Verify the backend starts successfully.
* Test API endpoints using Postman.
* Ensure Docker containers run without errors.
* Confirm new features work as expected.

## Pull Requests

When submitting a pull request:

* Clearly describe the purpose of the change.
* Keep pull requests focused on a single feature or fix.
* Ensure the application still builds successfully using Docker.

## Documentation

If your contribution changes functionality, please update the relevant documentation, including the README if necessary.

## Reporting issues

If you encounter any issues with the project, please open a GitHub issue with a clear and descriptive title, including details about the problem and how to reproduce it. 

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers. (see CODE_OF_CONDUCT file)

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License (see LICENSE file).

Thank you for helping improve this project!
