using ToDoListApp.Entities.Repositories;

namespace ToDoListApp.Application.ToDo.QueryHandlers
{
    public class GetToDoByIdQueryHandler
    {
        private readonly IToDoRepository _repository;

        public GetToDoByIdQueryHandler(IToDoRepository repository)
        {
            _repository = repository;
        }

        public ToDoItemDto Handle(GetToDoByIdRequest request)
        {
            var item = _repository.GetById(request.Id);
            if (item == null) return null;

            return new ToDoItemDto
            {
                Id = item.Id,
                Title = item.Title,
                Description = item.Description,
                IsCompleted = item.IsCompleted,
                CreatedAt = item.CreatedAt
            };
        }
    }
}