using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Npgsql;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public class MatchRepository : BaseRepository, IMatchRepository
    {
        public MatchRepository(IConfiguration configuration) : base(configuration) { }

        public async Task CreateMatchAsync(int userAId, int userBId)
        {
            // LOGIC: We sort IDs so (1, 2) is the same match as (2, 1).
            // This prevents duplicates in the database.
            int minId = Math.Min(userAId, userBId);
            int maxId = Math.Max(userAId, userBId);

            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = @"
                INSERT INTO matches (user_a_id, user_b_id)
                VALUES (@user_a_id, @user_b_id)
                ON CONFLICT (user_a_id, user_b_id) DO NOTHING";
            
            cmd.Parameters.AddWithValue("user_a_id", minId);
            cmd.Parameters.AddWithValue("user_b_id", maxId);

            conn.Open();
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<IEnumerable<User>> GetMatchesForUserAsync(int userId)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            
            // Join matches with users to get the OTHER user's details
            cmd.CommandText = @"
                SELECT u.id, u.first_name, u.last_name, u.age, u.email, u.bio, u.user_type, u.created_at
                FROM matches m
                JOIN users u ON (u.id = m.user_a_id OR u.id = m.user_b_id)
                WHERE (m.user_a_id = @user_id OR m.user_b_id = @user_id)
                  AND u.id != @user_id";
            
            cmd.Parameters.AddWithValue("user_id", userId);

            conn.Open();
            using var reader = await cmd.ExecuteReaderAsync();
            var matches = new List<User>();
            while (await reader.ReadAsync())
            {
                matches.Add(new User
                {
                    Id = reader.GetInt32(0),
                    FirstName = reader.GetString(1),
                    LastName = reader.GetString(2),
                    Age = reader.GetInt32(3),
                    Email = reader.GetString(4),
                    Bio = reader.IsDBNull(5) ? null : reader.GetString(5),
                    UserType = reader.GetString(6),
                    CreatedAt = reader.GetDateTime(7)
                });
            }
            return matches;
        }
    }
}
