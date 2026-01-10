using System;

namespace RoomieMatch.Model.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public string Content { get; set; }
        public DateTime DateSent { get; set; }
        public DateTime? DateRead { get; set; }

        // Navigation properties (optional but good for EF, here likely ignored by Dapper/Raw SQL but good for understanding)
        // public User Sender { get; set; }
        // public User Recipient { get; set; }
    }
}
