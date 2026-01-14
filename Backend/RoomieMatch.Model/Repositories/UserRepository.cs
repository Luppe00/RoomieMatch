using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Npgsql;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(IConfiguration configuration) : base(configuration) { }

        // CRUD: Read All Users
        // Uses LEFT JOIN to fetch users AND their room details in one query.
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            var users = new List<User>();
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = @"
                SELECT u.id, u.first_name, u.last_name, u.age, u.gender, u.email, u.bio, u.user_type, u.created_at, u.profile_image,
                       r.id, r.title, r.location, r.rent, r.size_sqm, r.room_image, r.description, r.available_from
                FROM users u
                LEFT JOIN rooms r ON u.id = r.user_id";
            
            conn.Open();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                users.Add(MapUserWithRoom(reader));
            }
            return users;
        }

        public async Task<IEnumerable<User>> GetPotentialMatchesAsync(int currentUserId, string currentUserType, Preference? preference = null)
        {
            var users = new List<User>();
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            
            // Logic: 
            // If HAS_ROOM -> Show NEEDS_ROOM
            // If NEEDS_ROOM -> Show HAS_ROOM
            
            string targetType = (currentUserType == "HAS_ROOM") ? "NEEDS_ROOM" : "HAS_ROOM";

            // Build dynamic SQL with preference filters
            var sql = @"
                SELECT u.id, u.first_name, u.last_name, u.age, u.gender, u.email, u.bio, u.user_type, u.created_at, u.profile_image,
                       r.id, r.title, r.location, r.rent, r.size_sqm, r.room_image, r.description, r.available_from
                FROM users u
                LEFT JOIN rooms r ON u.id = r.user_id
                WHERE u.user_type = @targetType 
                  AND u.id != @currentUserId
                  AND NOT EXISTS (
                      SELECT 1 FROM swipes s 
                      WHERE s.swiper_user_id = @currentUserId AND s.target_user_id = u.id
                  )";

            // Apply preference filters if available
            if (preference != null)
            {
                // Filter by max rent (for NEEDS_ROOM users looking at HAS_ROOM profiles with rooms)
                if (currentUserType == "NEEDS_ROOM" && preference.MaxRent.HasValue)
                {
                    sql += " AND (r.rent IS NULL OR r.rent <= @maxRent)";
                    cmd.Parameters.AddWithValue("maxRent", preference.MaxRent.Value);
                }

                // Filter by preferred gender
                if (!string.IsNullOrEmpty(preference.PreferredGender) && preference.PreferredGender != "Any")
                {
                    sql += " AND u.gender = @preferredGender";
                    cmd.Parameters.AddWithValue("preferredGender", preference.PreferredGender);
                }

                // Filter by min age
                if (preference.MinAgeRoomie.HasValue)
                {
                    sql += " AND u.age >= @minAge";
                    cmd.Parameters.AddWithValue("minAge", preference.MinAgeRoomie.Value);
                }

                // Filter by max age
                if (preference.MaxAgeRoomie.HasValue)
                {
                    sql += " AND u.age <= @maxAge";
                    cmd.Parameters.AddWithValue("maxAge", preference.MaxAgeRoomie.Value);
                }

                // Filter by preferred location (check if room location contains the preference)
                if (!string.IsNullOrEmpty(preference.PreferredLocation) && currentUserType == "NEEDS_ROOM")
                {
                    sql += " AND (r.location IS NULL OR LOWER(r.location) LIKE @preferredLocation)";
                    cmd.Parameters.AddWithValue("preferredLocation", "%" + preference.PreferredLocation.ToLower() + "%");
                }
            }

            cmd.CommandText = sql;
            cmd.Parameters.AddWithValue("targetType", targetType);
            cmd.Parameters.AddWithValue("currentUserId", currentUserId);

            conn.Open();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                users.Add(MapUserWithRoom(reader));
            }
            return users;
        }

        // CRUD: Read One User
        // "WHERE u.id = @id" finds a specific person.
        public async Task<User?> GetByIdAsync(int id)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = @"
                SELECT u.id, u.first_name, u.last_name, u.age, u.gender, u.email, u.bio, u.user_type, u.created_at, u.profile_image,
                       r.id, r.title, r.location, r.rent, r.size_sqm, r.room_image, r.description, r.available_from
                FROM users u
                LEFT JOIN rooms r ON u.id = r.user_id
                WHERE u.id = @id";
            cmd.Parameters.AddWithValue("id", id);

            conn.Open();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return MapUserWithRoom(reader);
            }
            return null;
        }

        // CRUD: Create
        // "RETURNING id" lets us get the new ID back instantly after inserting.
        public async Task<int> CreateAsync(User user)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = @"
                INSERT INTO users (first_name, last_name, age, gender, email, bio, user_type, profile_image)
                VALUES (@first_name, @last_name, @age, @gender, @email, @bio, @user_type, @profile_image)
                RETURNING id";
            
            cmd.Parameters.AddWithValue("first_name", user.FirstName);
            cmd.Parameters.AddWithValue("last_name", user.LastName);
            cmd.Parameters.AddWithValue("age", user.Age);
            cmd.Parameters.AddWithValue("gender", user.Gender);
            cmd.Parameters.AddWithValue("email", user.Email);
            cmd.Parameters.AddWithValue("bio", (object?)user.Bio ?? DBNull.Value);
            cmd.Parameters.AddWithValue("user_type", user.UserType);
            cmd.Parameters.AddWithValue("profile_image", (object?)user.ProfileImage ?? DBNull.Value);

            conn.Open();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        // CRUD: Update an existing user
        public async Task UpdateAsync(User user)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = @"
                UPDATE users 
                SET first_name = @first_name, last_name = @last_name, age = @age, gender = @gender, email = @email, bio = @bio, user_type = @user_type, profile_image = @profile_image
                WHERE id = @id";

            cmd.Parameters.AddWithValue("id", user.Id);
            cmd.Parameters.AddWithValue("first_name", user.FirstName);
            cmd.Parameters.AddWithValue("last_name", user.LastName);
            cmd.Parameters.AddWithValue("age", user.Age);
            cmd.Parameters.AddWithValue("gender", user.Gender);
            cmd.Parameters.AddWithValue("email", user.Email);
            cmd.Parameters.AddWithValue("bio", (object?)user.Bio ?? DBNull.Value);
            cmd.Parameters.AddWithValue("user_type", user.UserType);
            cmd.Parameters.AddWithValue("profile_image", (object?)user.ProfileImage ?? DBNull.Value);

            conn.Open();
            await cmd.ExecuteNonQueryAsync();
        }

        // CRUD: Delete a user
        public async Task DeleteAsync(int id)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = "DELETE FROM users WHERE id = @id";
            cmd.Parameters.AddWithValue("id", id);

            conn.Open();
            await cmd.ExecuteNonQueryAsync();
        }

        // HELPER: Connects the raw Database Data (Rows) to our C# Code (Objects).
        // It handles null checks so the app doesn't crash.
        private static User MapUserWithRoom(NpgsqlDataReader reader)
        {
            var user = new User
            {
                Id = reader.GetInt32(0),
                FirstName = reader.GetString(1),
                LastName = reader.GetString(2),
                Age = reader.GetInt32(3),
                Gender = reader.GetString(4),
                Email = reader.GetString(5),
                Bio = reader.IsDBNull(6) ? null : reader.GetString(6),
                UserType = reader.GetString(7),
                CreatedAt = reader.GetDateTime(8),
                ProfileImage = reader.IsDBNull(9) ? null : reader.GetString(9)
            };

            // Check if room data exists (col 10: r.id)
            if (!reader.IsDBNull(10))
            {
                user.Room = new Room
                {
                    Id = reader.GetInt32(10),
                    UserId = user.Id,
                    Title = reader.GetString(11),
                    Location = reader.GetString(12),
                    Rent = reader.GetDecimal(13),
                    SizeSqm = reader.IsDBNull(14) ? null : reader.GetInt32(14),
                    RoomImage = reader.IsDBNull(15) ? null : reader.GetString(15),
                    Description = reader.IsDBNull(16) ? null : reader.GetString(16),
                    AvailableFrom = reader.IsDBNull(17) ? null : reader.GetDateTime(17)
                };
            }

            return user;
        }
    }
}
