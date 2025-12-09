using System;

namespace RoomieMatch.Model.Entities
{
    public class Swipe
    {
        public int Id { get; set; }
        public int SwiperUserId { get; set; }
        public int TargetUserId { get; set; }
        public bool Liked { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
