# RoomieMatch

A full-stack web application for finding roommates and housing matches.
- **Frontend**: Angular
- **Backend**: ASP.NET Core Web API
- **Database**: PostgreSQL

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have these installed:
-   [PostgreSQL](https://postgresapp.com/) (Running on port 5432)
-   [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
-   [Node.js & npm](https://nodejs.org/)

### 2. Run the Backend
Open a terminal in the root folder:
```bash
dotnet run --project Backend/RoomieMatch.API
```
> **Note:** Your data is safe! It will NOT be deleted when you restart.

### 3. Run the Frontend
Open a new terminal window:
```bash
cd Frontend/RoomieMatch-SPA
npm start
```

### 4. Open the App
-   **App**: [http://localhost:4200](http://localhost:4200)
-   **API**: [http://localhost:5247](http://localhost:5247)

---

## 💾 Database Management

### Reset Database (Delete & Re-seed)
If you want to **delete all data** and start fresh with sample users:
```bash
dotnet run --project Backend/RoomieMatch.API -- --init-db
```

### Import Backup (For Friends)
If you have received the `roomiematch_backup.sql` file:

1.  Create an empty database named `RoomieMatchDb`.
2.  Run this command in your terminal:
    ```bash
    psql -h localhost -U postgres -d RoomieMatchDb -f roomiematch_backup.sql
    ```
