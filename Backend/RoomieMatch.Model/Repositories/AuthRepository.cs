using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Npgsql;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public class AuthRepository : BaseRepository, IAuthRepository
    {
        public AuthRepository(IConfiguration configuration) : base(configuration) { }

        public async Task<User> Register(User user, string password)
        {
            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            
            // Insert user with password hash/salt
            cmd.CommandText = @"
                INSERT INTO users (first_name, last_name, age, gender, email, bio, user_type, profile_image, password_hash, password_salt)
                VALUES (@first_name, @last_name, @age, @gender, @email, @bio, @user_type, @profile_image, @password_hash, @password_salt)
                RETURNING id, created_at";

            cmd.Parameters.AddWithValue("first_name", user.FirstName);
            cmd.Parameters.AddWithValue("last_name", user.LastName);
            cmd.Parameters.AddWithValue("age", user.Age);
            cmd.Parameters.AddWithValue("gender", user.Gender);
            cmd.Parameters.AddWithValue("email", user.Email);
            cmd.Parameters.AddWithValue("bio", (object?)user.Bio ?? DBNull.Value);
            cmd.Parameters.AddWithValue("user_type", user.UserType);
            cmd.Parameters.AddWithValue("profile_image", (object?)user.ProfileImage ?? DBNull.Value);
            cmd.Parameters.AddWithValue("password_hash", user.PasswordHash);
            cmd.Parameters.AddWithValue("password_salt", user.PasswordSalt);

            conn.Open();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                user.Id = reader.GetInt32(0);
                user.CreatedAt = reader.GetDateTime(1);
            }

            return user;
        }

        public async Task<User?> Login(string email, string password)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            
            // Fetch password hash/salt for the email
            cmd.CommandText = "SELECT id, email, password_hash, password_salt FROM users WHERE email = @email";
            cmd.Parameters.AddWithValue("email", email);

            conn.Open();
            using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
                return null; // User not found

            // Check if password entries are null (legacy users)
            if (reader.IsDBNull(2) || reader.IsDBNull(3))
                return null; // or handle legacy login logic if needed

            var storedHash = (byte[])reader["password_hash"];
            var storedSalt = (byte[])reader["password_salt"];

            if (!VerifyPasswordHash(password, storedHash, storedSalt))
                return null; // Wrong password

            // Password correct! Return full user object (excluding password)
            // Ideally we reuse GetById logic or fetch essential fields here.
            // For now, let's return a basic User object or fetch full with another query.
            // Let's just return the user with ID and Email for now to trigger the token generation.
            var user = new User 
            {
                Id = reader.GetInt32(0),
                Email = reader.GetString(1)
            };
            return user;
        }

        public async Task<bool> UserExists(string email)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = "SELECT COUNT(1) FROM users WHERE email = @email";
            cmd.Parameters.AddWithValue("email", email);

            conn.Open();
            var count = Convert.ToInt32(await cmd.ExecuteScalarAsync());
            return count > 0;
        }

        // --- Helpers ---

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != storedHash[i]) return false;
            }
            return true;
        }
    }
}
