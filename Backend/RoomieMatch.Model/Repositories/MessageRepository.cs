using Microsoft.Extensions.Configuration;
using Npgsql;
using RoomieMatch.Model.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RoomieMatch.Model.Repositories
{
    public class MessageRepository : BaseRepository, IMessageRepository
    {
        public MessageRepository(IConfiguration configuration) : base(configuration) { }

        public async Task AddMessage(Message message)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            cmd.CommandText = @"
                INSERT INTO messages (sender_id, recipient_id, content, date_sent)
                VALUES (@senderId, @recipientId, @content, @dateSent)
                RETURNING id";
            
            cmd.Parameters.AddWithValue("senderId", message.SenderId);
            cmd.Parameters.AddWithValue("recipientId", message.RecipientId);
            cmd.Parameters.AddWithValue("content", message.Content);
            cmd.Parameters.AddWithValue("dateSent", message.DateSent);

            conn.Open();
            message.Id = (int)await cmd.ExecuteScalarAsync();
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int currentUserId, int recipientId)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            
            // Get conversation between two users
            cmd.CommandText = @"
                SELECT id, sender_id, recipient_id, content, date_sent, date_read 
                FROM messages 
                WHERE (sender_id = @currentUserId AND recipient_id = @recipientId) 
                   OR (sender_id = @recipientId AND recipient_id = @currentUserId)
                ORDER BY date_sent ASC";

            cmd.Parameters.AddWithValue("currentUserId", currentUserId);
            cmd.Parameters.AddWithValue("recipientId", recipientId);

            conn.Open();
            using var reader = await cmd.ExecuteReaderAsync();
            var messages = new List<Message>();

            while (await reader.ReadAsync())
            {
                messages.Add(new Message
                {
                    Id = reader.GetInt32(0),
                    SenderId = reader.GetInt32(1),
                    RecipientId = reader.GetInt32(2),
                    Content = reader.GetString(3),
                    DateSent = reader.GetDateTime(4),
                    DateRead = reader.IsDBNull(5) ? null : reader.GetDateTime(5)
                });
            }

            return messages;
        }

        public async Task MarkMessagesAsRead(int currentUserId, int senderId)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            
            // Mark all messages FROM sender TO currentUser as read
            cmd.CommandText = @"
                UPDATE messages 
                SET date_read = @dateRead 
                WHERE sender_id = @senderId 
                  AND recipient_id = @currentUserId 
                  AND date_read IS NULL";

            cmd.Parameters.AddWithValue("dateRead", DateTime.UtcNow);
            cmd.Parameters.AddWithValue("senderId", senderId);
            cmd.Parameters.AddWithValue("currentUserId", currentUserId);

            conn.Open();
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<int> GetUnreadCount(int userId)
        {
            using var conn = CreateConnection();
            using var cmd = conn.CreateCommand() as NpgsqlCommand;
            
            cmd.CommandText = @"
                SELECT COUNT(*) 
                FROM messages 
                WHERE recipient_id = @userId AND date_read IS NULL";

            cmd.Parameters.AddWithValue("userId", userId);

            conn.Open();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }
    }
}
