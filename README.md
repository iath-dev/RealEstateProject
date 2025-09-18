# Million Real Estate

This project is a full-stack application for a large real estate company. It includes a backend API to fetch property information from a database and a web page to display this information.

## Project Overview

A large real estate company requires the creation of an API to fetch information about properties stored in a database, and a web page to display this information. The goal is to create a full-stack application using .NET, MongoDB, C#, and ReactJS or Next.js. The project will involve building a set of services to manage property data and create a user interface to display it.

## Technologies Required

- **Backend**: .NET 8 or 9, C#
- **Database**: MongoDB
- **Frontend**: ReactJS or Next.js
- **Testing**: NUnit for unit testing

## Task Breakdown

### Backend (API) Development

- Create a C# API using .NET 8 or 9 to retrieve property data from the MongoDB database.
- Implement filters in the API for retrieving a list of properties based on parameters like name, address and range price.
- Define Dtos fields such as:
  - IdOwner, Name, Address Property, Price Property and just one image.

### Frontend (Web Page) Development

- Create a web page using ReactJS or Next.js to display the property data.
- The page should include:
  - A list of properties, fetched from the API.
    - Filters for searching properties (name, address and range price).
  - Option to view more details about individual properties.
- Ensure the frontend is responsive, providing a seamless user experience across different devices.

## Getting Started

This project is fully containerized and can be run easily using Docker and Make.

### Prerequisites

- **Docker Desktop**: To run the containers.
- **Make**: To use the simplified commands. On Windows, you can use `make` via WSL, Chocolatey, or other package managers.

### 1. Running the Application

This single command will build the Docker images, start all the services (frontend, backend, database), and open the application in your web browser.

```sh
make start
```

The application will be available at `http://localhost:3000`.

### 2. Accessing Services

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`
- **Backend Swagger UI**: `http://localhost:8080/index.html`
- **Mongo Express (Database UI)**: `http://localhost:8081`

### 3. Running Tests

To run all the tests for both the backend and frontend, use the following command:

```sh
make test
```

### 4. Stopping the Application

To stop all the running containers, use:

```sh
make stop
```

For a complete cleanup that removes containers, volumes, and images, use:

```sh
make clean
```

## Demo

Here is a video demonstrating the functionality of the project:

[![Watch the video](https://img.youtube.com/vi/YbHKVqzGoLw/maxresdefault.jpg)](https://youtu.be/YbHKVqzGoLw)

## Evaluation Criteria

- **Backend and Frontend Architecture**: Implement a clean and efficient architecture for both the backend API and the frontend web page.
- **Code Structure**: Organize code in a modular and maintainable way.
- **Documentation**: Provide clear and concise documentation for both the API and frontend code.
- **Best Practices**: Follow best practices in both backend and frontend development, including:
  - Clean architecture
  - Proper error handling
  - Optimized queries to database (if required)
- **Performance**: Ensure both the API and frontend are optimized for performance, especially for handling large datasets or multiple filters.
- **Unit Testing**: Write unit tests for both the backend API and the frontend components using NUnit or other appropriate testing frameworks.
- **Clean Code**: Ensure that the code is readable, maintainable, and follows established coding conventions.
