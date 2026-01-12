using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Npgsql;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public class PreferenceRepository : BaseRepository, IPreferenceRepository
    {
        public PreferenceRepository(IConfiguration configuration) : base(configuration) { }

        public async Task<Preference?> GetByUserIdAsync(int userId)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = @"SELECT id, user_id, max_rent, preferred_location, min_age_roomie, max_age_roomie, 
                                      preferred_gender, preferred_locations, rent_period, smoker_preference
                               FROM preferences WHERE user_id = @user_id";
            cmd.Parameters.AddWithValue("user_id", userId);

            conn.Open();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return MapPreference(reader);
            }
            return null;
        }

        // LOGIC: Upsert (Update or Insert)
        // If the preference exists, update it. If not, create it.
        // We use SQL "ON CONFLICT" to do this in one step.
        public async Task UpsertAsync(Preference preference)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            
            cmd.CommandText = @"
                INSERT INTO preferences (user_id, max_rent, preferred_location, min_age_roomie, max_age_roomie, 
                                        preferred_gender, preferred_locations, rent_period, smoker_preference)
                VALUES (@user_id, @max_rent, @preferred_location, @min_age_roomie, @max_age_roomie, 
                        @preferred_gender, @preferred_locations, @rent_period, @smoker_preference)
                ON CONFLICT (user_id) DO UPDATE 
                SET max_rent = EXCLUDED.max_rent,
                    preferred_location = EXCLUDED.preferred_location,
                    min_age_roomie = EXCLUDED.min_age_roomie,
                    max_age_roomie = EXCLUDED.max_age_roomie,
                    preferred_gender = EXCLUDED.preferred_gender,
                    preferred_locations = EXCLUDED.preferred_locations,
                    rent_period = EXCLUDED.rent_period,
                    smoker_preference = EXCLUDED.smoker_preference";

            cmd.Parameters.AddWithValue("user_id", preference.UserId);
            cmd.Parameters.AddWithValue("max_rent", (object?)preference.MaxRent ?? DBNull.Value);
            cmd.Parameters.AddWithValue("preferred_location", (object?)preference.PreferredLocation ?? DBNull.Value);
            cmd.Parameters.AddWithValue("min_age_roomie", (object?)preference.MinAgeRoomie ?? DBNull.Value);
            cmd.Parameters.AddWithValue("max_age_roomie", (object?)preference.MaxAgeRoomie ?? DBNull.Value);
            cmd.Parameters.AddWithValue("preferred_gender", (object?)preference.PreferredGender ?? DBNull.Value);
            cmd.Parameters.AddWithValue("preferred_locations", (object?)preference.PreferredLocations ?? DBNull.Value);
            cmd.Parameters.AddWithValue("rent_period", (object?)preference.RentPeriod ?? DBNull.Value);
            cmd.Parameters.AddWithValue("smoker_preference", (object?)preference.SmokerPreference ?? DBNull.Value);

            conn.Open();
            await cmd.ExecuteNonQueryAsync();
        }

        private static Preference MapPreference(NpgsqlDataReader reader)
        {
            return new Preference
            {
                Id = reader.GetInt32(0),
                UserId = reader.GetInt32(1),
                MaxRent = reader.IsDBNull(2) ? null : reader.GetDecimal(2),
                PreferredLocation = reader.IsDBNull(3) ? null : reader.GetString(3),
                MinAgeRoomie = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                MaxAgeRoomie = reader.IsDBNull(5) ? null : reader.GetInt32(5),
                PreferredGender = reader.IsDBNull(6) ? null : reader.GetString(6),
                PreferredLocations = reader.IsDBNull(7) ? null : reader.GetString(7),
                RentPeriod = reader.IsDBNull(8) ? null : reader.GetString(8),
                SmokerPreference = reader.IsDBNull(9) ? null : reader.GetString(9)
            };
        }
    }
}
