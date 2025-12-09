using System;
using System.IO;
using Npgsql;

public class Program
{
    public static void Main(string[] args)
    {
        string connectionString = "Host=localhost;Port=5432;Database=RoomieMatchDb;Username=postgres;Password=postgres";
        string schemaPath = Path.Combine(Directory.GetCurrentDirectory(), "schema.sql");
        string seedPath = Path.Combine(Directory.GetCurrentDirectory(), "seed.sql");

        try
        {
            using var conn = new NpgsqlConnection(connectionString);
            conn.Open();
            Console.WriteLine("✅ Database connection established.");

            ExecuteScript(conn, schemaPath);
            ExecuteScript(conn, seedPath);

            Console.WriteLine("🎉 Database setup complete!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error: {ex.Message}");
            // If DB doesn't exist, we might need to create it. 
            // But usually 'postgres' db exists, so we could connect to that and create RoomieMatchDb.
            // For now, assume DB 'RoomieMatchDb' might exist or we might need to create it.
            // Let's try connecting to 'postgres' db to create the target db if it fails.
        }
    }

    static void ExecuteScript(NpgsqlConnection conn, string path)
    {
        if (!File.Exists(path))
        {
            Console.WriteLine($"⚠️ File not found: {path}");
            return;
        }

        string sql = File.ReadAllText(path);
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        Console.WriteLine($"✅ Executed: {Path.GetFileName(path)}");
    }
}
