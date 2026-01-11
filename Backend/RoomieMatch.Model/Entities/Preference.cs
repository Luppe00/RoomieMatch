namespace RoomieMatch.Model.Entities
{
    public class Preference
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal? MaxRent { get; set; }
        public string? PreferredLocation { get; set; }
        public string? PreferredLocations { get; set; } // Comma-separated list of locations
        public string? PreferredGender { get; set; } // "Male", "Female", "Other", "Any"
        public int? MinAgeRoomie { get; set; }
        public int? MaxAgeRoomie { get; set; }
        public string? RentPeriod { get; set; } // "1-3 months", "3-6 months", etc.
        public string? SmokerPreference { get; set; } // "No preference", "Non-smoker only", "Smoker OK"
    }
}
