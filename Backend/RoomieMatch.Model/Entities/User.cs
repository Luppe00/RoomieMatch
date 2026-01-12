using System;

namespace RoomieMatch.Model.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; } // "Male", "Female", "Other"
        public string Email { get; set; }
        public string? ProfileImage { get; set; }
        // Improvement 1: Include Room Details
        public Room? Room { get; set; }
        public string? Bio { get; set; }
        public string UserType { get; set; } // "HAS_ROOM" or "NEEDS_ROOM"
        public byte[]? PasswordHash { get; set; }
        public byte[]? PasswordSalt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
