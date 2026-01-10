using System;
using Npgsql;

namespace RoomieMatch.Model.Helpers
{
    public static class DbHelper
    {
        public static string ParseConnection(string connectionString)
        {
            // If it's a standard connection string (Key=Value), just return it
            if (string.IsNullOrWhiteSpace(connectionString) || !connectionString.StartsWith("postgres://") && !connectionString.StartsWith("postgresql://"))
            {
                return connectionString;
            }

            try 
            {
                var uri = new Uri(connectionString);
                var userInfo = uri.UserInfo.Split(':');
                var builder = new NpgsqlConnectionStringBuilder
                {
                    Host = uri.Host,
                    Port = uri.Port > 0 ? uri.Port : 5432,
                    Username = userInfo[0],
                    Password = userInfo.Length > 1 ? userInfo[1] : "",
                    Database = uri.AbsolutePath.TrimStart('/'),
                    Pooling = true // Default to true
                };

                return builder.ToString();
            }
            catch
            {
                // If parsing fails, fallback to original string
                return connectionString;
            }
        }
    }
}
