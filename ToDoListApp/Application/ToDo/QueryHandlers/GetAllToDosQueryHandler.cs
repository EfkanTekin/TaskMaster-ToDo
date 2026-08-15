        using System.Collections.Generic;
using System.Linq;
using ToDoListApp.Entities.Repositories;

namespace ToDoListApp.Application.ToDo.QueryHandlers
{
    public class GetAllToDosQueryHandler
    {

        private readonly IToDoRepository _repository;
        public GetAllToDosQueryHandler(IToDoRepository repository)
        {
            _repository = repository;
        }

        public List<ToDoItemDto> Handle(GetAllToDosRequest request)
        {
            var list = _repository.GetAll();


            return list.Select(x => new ToDoItemDto
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                IsCompleted = x.IsCompleted,
                CreatedAt = x.CreatedAt
            }).ToList();
        }
    }
}


