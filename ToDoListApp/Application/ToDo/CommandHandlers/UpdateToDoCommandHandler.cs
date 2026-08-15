using ToDoListApp.Entities;
using ToDoListApp.Entities.Repositories;

namespace ToDoListApp.Application.ToDo.CommandHandlers
{
    public class UpdateToDoCommandHandler
    {
        private readonly IToDoRepository _repository;

        public UpdateToDoCommandHandler(IToDoRepository repository)
        {
            _repository = repository;
        }

        public void Handle(UpdateToDoRequest request)
        {
            var entity = _repository.GetById(request.Id);
            if (entity != null)
            {
                entity.Title = request.Title;
                entity.IsCompleted = request.IsCompleted;
                entity.Description = request.Description;   
                _repository.Update(entity);
            }
        }
    }
}