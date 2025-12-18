# RoomieMatch ReadME-file.

### 1. Get database up and running
Download RoomieMatchDb.sql
- Open pgAdmin 4:
- Create a new database, call it: RoomieMatchDb
- Click Restore
- Find and open RoomieMatchDb.sql
- Click restore and refresh database

### 2. Prerequisites
- Open IDE

- Locate and open RoomieMatch

Ensure you have these installed:
-   [PostgreSQL](https://postgresapp.com/)
-   [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
-   [Node.js & npm](https://nodejs.org/)

### 3. (MAY BE DEMANDED) Change your port
- Go to RoomieMatch/Backend/RoomieMatch.API/appsettings.json
- Change Port no. to your own port

### 4. Run the Backend
Open a terminal in the root folder:
```bash
dotnet run --project Backend/RoomieMatch.API
```

### 5. Run the Frontend
Open a new terminal window:
```bash
cd Frontend/RoomieMatch-SPA
npm start
```

### 6. Open the App
-   **App**: [http://localhost:4200](http://localhost:4200)
-   **API**: [http://localhost:5247](http://localhost:5247)

---

If you have received the `roomiematch_backup.sql` file:

1.  Create an empty database named `RoomieMatchDb`.
2.  Run this command in your terminal:
    ```bash
    psql -h localhost -U postgres -d RoomieMatchDb -f roomiematch_backup.sql
    ```
