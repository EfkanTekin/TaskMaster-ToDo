using System.Security.Claims;
using ToDoListApp.Entities.Repositories;
using ToDoEntity = ToDoListApp.Entities.ToDo;

namespace ToDoListApp.Application.ToDo.CommandHandlers
{
    public class CreateToDoCommandHandler
    {
        private readonly IToDoRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CreateToDoCommandHandler(IToDoRepository repository, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }

        public void Handle(CreateToDoRequest request)
        {

            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? throw new UnauthorizedAccessException("Kullanıcı oturumu bulunamadı.");

            var entity = new ToDoEntity
            {
                Title = request.Title,
                Description = request.Description,
                IsCompleted = false,
                CreatedAt = System.DateTime.Now,
                UserId = userId
            };

            _repository.Add(entity);
        }
    }   
}

