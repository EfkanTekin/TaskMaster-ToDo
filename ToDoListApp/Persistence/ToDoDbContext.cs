using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ToDoListApp.Entities;

namespace ToDoListApp.Persistence
{
    public class ToDoDbContext : IdentityDbContext<ApplicationUser>
    {
        public ToDoDbContext(DbContextOptions<ToDoDbContext> options) : base(options) { }

        public DbSet<ToDo> ToDos { get; set; }
    }
}