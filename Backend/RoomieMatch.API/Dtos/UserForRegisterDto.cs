using System.ComponentModel.DataAnnotations;

namespace RoomieMatch.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 4, ErrorMessage = "You must specify a password between 4 and 50 characters")]
        public string Password { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public int Age { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string UserType { get; set; } // "HAS_ROOM" or "NEEDS_ROOM"
    }
}
