using System.ComponentModel.DataAnnotations;

namespace RoomieMatch.API.Dtos
{
    public class UserForLoginDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
