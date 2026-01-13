using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Npgsql;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public class RoomRepository : BaseRepository, IRoomRepository
    {
        public RoomRepository(IConfiguration configuration) : base(configuration) { }

        public async Task<IEnumerable<Room>> GetAllAsync()
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = "SELECT id, user_id, title, location, rent, size_sqm, room_image, room_images, description, available_from FROM rooms";
            
            conn.Open();
            using var reader = await cmd.ExecuteReaderAsync();
            var rooms = new List<Room>();
            while (await reader.ReadAsync())
            {
                rooms.Add(MapRoom(reader));
            }
            return rooms;
        }

        public async Task<Room?> GetByIdAsync(int id)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = "SELECT id, user_id, title, location, rent, size_sqm, room_image, room_images, description, available_from FROM rooms WHERE id = @id";
            cmd.Parameters.AddWithValue("id", id);
            
            conn.Open();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return MapRoom(reader);
            }
            return null;
        }

        public async Task<IEnumerable<Room>> GetByUserIdAsync(int userId)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = "SELECT id, user_id, title, location, rent, size_sqm, room_image, room_images, description, available_from FROM rooms WHERE user_id = @user_id";
            cmd.Parameters.AddWithValue("user_id", userId);
            
            conn.Open();
            using var reader = await cmd.ExecuteReaderAsync();
            var rooms = new List<Room>();
            while (await reader.ReadAsync())
            {
                rooms.Add(MapRoom(reader));
            }
            return rooms;
        }

        // CRUD: Create (Insert) a new Room
        // We use parameters (@rent, @title) to be safe from hackers (SQL Injection).
        public async Task<int> CreateAsync(Room room)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = @"
                INSERT INTO rooms (user_id, title, location, rent, size_sqm, room_image, room_images, description, available_from)
                VALUES (@user_id, @title, @location, @rent, @size_sqm, @room_image, @room_images, @description, @available_from)
                RETURNING id";
            
            cmd.Parameters.AddWithValue("user_id", room.UserId);
            cmd.Parameters.AddWithValue("title", room.Title);
            cmd.Parameters.AddWithValue("location", room.Location);
            cmd.Parameters.AddWithValue("rent", room.Rent);
            cmd.Parameters.AddWithValue("size_sqm", (object?)room.SizeSqm ?? DBNull.Value);
            cmd.Parameters.AddWithValue("room_image", (object?)room.RoomImage ?? DBNull.Value);
            cmd.Parameters.AddWithValue("room_images", room.RoomImages != null ? (object)room.RoomImages : DBNull.Value);
            cmd.Parameters.AddWithValue("description", (object?)room.Description ?? DBNull.Value);
            cmd.Parameters.AddWithValue("available_from", (object?)room.AvailableFrom ?? DBNull.Value);

            conn.Open();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task UpdateAsync(Room room)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = @"
                UPDATE rooms 
                SET title = @title, location = @location, rent = @rent, size_sqm = @size_sqm, room_image = @room_image, room_images = @room_images, description = @description, available_from = @available_from
                WHERE id = @id";
            
            cmd.Parameters.AddWithValue("id", room.Id);
            cmd.Parameters.AddWithValue("title", room.Title);
            cmd.Parameters.AddWithValue("location", room.Location);
            cmd.Parameters.AddWithValue("rent", room.Rent);
            cmd.Parameters.AddWithValue("size_sqm", (object?)room.SizeSqm ?? DBNull.Value);
            cmd.Parameters.AddWithValue("room_image", (object?)room.RoomImage ?? DBNull.Value);
            cmd.Parameters.AddWithValue("room_images", room.RoomImages != null ? (object)room.RoomImages : DBNull.Value);
            cmd.Parameters.AddWithValue("description", (object?)room.Description ?? DBNull.Value);
            cmd.Parameters.AddWithValue("available_from", (object?)room.AvailableFrom ?? DBNull.Value);

            conn.Open();
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task DeleteAsync(int id)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = "DELETE FROM rooms WHERE id = @id";
            cmd.Parameters.AddWithValue("id", id);
            
            conn.Open();
            await cmd.ExecuteNonQueryAsync();
        }

        private static Room MapRoom(NpgsqlDataReader reader)
        {
            // Safely read room_images - may not exist or may have issues
            string[]? roomImages = null;
            try 
            {
                // Check if column exists and has data
                var ordinal = reader.GetOrdinal("room_images");
                if (!reader.IsDBNull(ordinal))
                {
                    roomImages = reader.GetFieldValue<string[]>(ordinal);
                }
            }
            catch 
            {
                // Column doesn't exist or other error - just continue with null
                roomImages = null;
            }

            return new Room
            {
                Id = reader.GetInt32(reader.GetOrdinal("id")),
                UserId = reader.GetInt32(reader.GetOrdinal("user_id")),
                Title = reader.GetString(reader.GetOrdinal("title")),
                Location = reader.GetString(reader.GetOrdinal("location")),
                Rent = reader.GetDecimal(reader.GetOrdinal("rent")),
                SizeSqm = reader.IsDBNull(reader.GetOrdinal("size_sqm")) ? null : reader.GetInt32(reader.GetOrdinal("size_sqm")),
                RoomImage = reader.IsDBNull(reader.GetOrdinal("room_image")) ? null : reader.GetString(reader.GetOrdinal("room_image")),
                RoomImages = roomImages,
                Description = reader.IsDBNull(reader.GetOrdinal("description")) ? null : reader.GetString(reader.GetOrdinal("description")),
                AvailableFrom = reader.IsDBNull(reader.GetOrdinal("available_from")) ? null : reader.GetDateTime(reader.GetOrdinal("available_from"))
            };
        }
    }
}
