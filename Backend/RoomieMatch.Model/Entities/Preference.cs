namespace RoomieMatch.Model.Entities
{
    public class Preference
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal? MaxRent { get; set; }
        public string? PreferredLocation { get; set; }
        public string? PreferredGender { get; set; } // "Male", "Female", "Other", "Any"
        public int? MinAgeRoomie { get; set; }
        public int? MaxAgeRoomie { get; set; }
    }
}
