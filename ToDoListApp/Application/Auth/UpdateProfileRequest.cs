namespace ToDoListApp.Application.Auth
{
    public class UpdateProfileRequest
    {
        public string Username { get; set; } = string.Empty; 
        public string Email { get; set; } = string.Empty;
        public string? NewPassword { get; set; }
        public string? ProfilePicture { get; set; }


    }
}