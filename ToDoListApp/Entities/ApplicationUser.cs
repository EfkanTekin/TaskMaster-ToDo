using Microsoft.AspNetCore.Identity;

namespace ToDoListApp.Entities
{
    public class ApplicationUser : IdentityUser
    {
        
        public string? ProfilePicture { get; set; }
    }
}