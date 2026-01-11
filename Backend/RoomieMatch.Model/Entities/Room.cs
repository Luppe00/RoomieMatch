using System;

namespace RoomieMatch.Model.Entities
{
    public class Room
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public decimal Rent { get; set; } // numeric in DB
        public int? SizeSqm { get; set; }
        public string? RoomImage { get; set; }
        public string[]? RoomImages { get; set; } // Multiple photos
        public string? Description { get; set; }
        public DateTime? AvailableFrom { get; set; }
    }
}
