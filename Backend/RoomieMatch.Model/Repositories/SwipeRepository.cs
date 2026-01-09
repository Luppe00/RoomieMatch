using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Npgsql;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public class SwipeRepository : BaseRepository, ISwipeRepository
    {
        public SwipeRepository(IConfiguration configuration) : base(configuration) { }

        public async Task CreateOrUpdateSwipeAsync(Swipe swipe)
        {
            // create connection to Postgres
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            
            // RAW SQL: We use "ON CONFLICT" to handle re-swipes (Upsert)
            // If the swipe exists, we just update the 'liked' status.
            cmd.CommandText = @"
                INSERT INTO swipes (swiper_user_id, target_user_id, liked)
                VALUES (@swiper_user_id, @target_user_id, @liked)
                ON CONFLICT (swiper_user_id, target_user_id) 
                DO UPDATE SET liked = EXCLUDED.liked, created_at = NOW()";
            
            // Parameters prevent SQL Injection (Security!)
            cmd.Parameters.AddWithValue("swiper_user_id", swipe.SwiperUserId);
            cmd.Parameters.AddWithValue("target_user_id", swipe.TargetUserId);
            cmd.Parameters.AddWithValue("liked", swipe.Liked);
            
            conn.Open();
            await cmd.ExecuteNonQueryAsync(); // Execute the command
        }

        public async Task<Swipe?> GetSwipeAsync(int swiperUserId, int targetUserId)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = "SELECT id, swiper_user_id, target_user_id, liked, created_at FROM swipes WHERE swiper_user_id = @swiper_user_id AND target_user_id = @target_user_id";
            cmd.Parameters.AddWithValue("swiper_user_id", swiperUserId);
            cmd.Parameters.AddWithValue("target_user_id", targetUserId);

            conn.Open();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Swipe
                {
                    Id = reader.GetInt32(0),
                    SwiperUserId = reader.GetInt32(1),
                    TargetUserId = reader.GetInt32(2),
                    Liked = reader.GetBoolean(3),
                    CreatedAt = reader.GetDateTime(4)
                };
            }
            return null;
        }
    }
}
