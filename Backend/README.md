# RoomieMatch Backend

This is the backend Web API for RoomieMatch, built with ASP.NET Core.

## Prerequisites

-   [.NET SDK](https://dotnet.microsoft.com/download) (Compatible with the project version)
-   SQL Server (or a compatible database provider)

## Database Setup

1.  Ensure you have a SQL Server instance running.
2.  Apply the database schema:
    -   Execute the `schema.sql` file located in the root `RoomieFinal` directory to create the tables.
3.  Seed the database:
    -   Execute the `seed.sql` file located in the root `RoomieFinal` directory to populate initial data.

## Configuration

-   The API is configured to listen on `http://localhost:5247` by default (see `launchSettings.json`).
-   Update `appsettings.json` with your specific database connection string if necessary.

## Running the API

1.  Navigate to the `RoomieMatch.API` directory (or the directory containing the `.sln` file).
2.  Run the application:
    ```bash
    dotnet run --project RoomieMatch.API
    ```
    Or if running from the solution level:
    ```bash
    dotnet run --project Backend/RoomieMatch.API
    ```

## API Documentation

Once running, you can access the API endpoints at `http://localhost:5247`.
