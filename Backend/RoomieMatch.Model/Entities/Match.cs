using System;

namespace RoomieMatch.Model.Entities
{
    public class Match
    {
        public int Id { get; set; }
        public int UserAId { get; set; }
        public int UserBId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
