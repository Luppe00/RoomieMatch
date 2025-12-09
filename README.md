# RoomieMatch

RoomieMatch is a full-stack web application designed to help users find roommates and matches for housing. It consists of an Angular frontend and an ASP.NET Core Web API backend.

## Project Structure

-   **Frontend**: Angular Single Page Application (SPA). Located in `Frontend/RoomieMatch-SPA`.
-   **Backend**: ASP.NET Core Web API. Located in `Backend`.
-   **Database**: SQL scripts (`schema.sql`, `seed.sql`) for setting up the database.

## Getting Started

To run the full application locally, you will need to start both the backend server and the frontend development server.

### 1. Database Setup
Ensure your SQL Server database is running and initialized.
-   Run `schema.sql` to create the tables.
-   Run `seed.sql` to insert sample data.

### 2. Start the Backend
Navigate to the `Backend` directory and follow the [Backend README](./Backend/README.md) to start the API server.
Typically:
```bash
cd Backend
dotnet run --project RoomieMatch.API
```
The backend will run on `http://localhost:5247`.

### 3. Start the Frontend
Navigate to the `Frontend/RoomieMatch-SPA` directory and follow the [Frontend README](./Frontend/RoomieMatch-SPA/README.md) to start the Angular app.
Typically:
```bash
cd Frontend/RoomieMatch-SPA
npm install
ng serve
```
The frontend will be accessible at `http://localhost:4200`.

## Features
-   User Authentication
-   Room Listings
-   Matching Logic
-   Chat/Messaging (Planned/Implemented)

For more details, please refer to the specific documentation in the `Frontend` and `Backend` directories.
