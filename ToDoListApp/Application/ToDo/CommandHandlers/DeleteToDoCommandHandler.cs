using ToDoListApp.Entities.Repositories;

namespace ToDoListApp.Application.ToDo.CommandHandlers
{
    public class DeleteToDoCommandHandler
    {
        private readonly IToDoRepository _repository;

        public DeleteToDoCommandHandler(IToDoRepository repository)
        {
            _repository = repository;
        }

        public void Handle(DeleteToDoRequest request)
        {
            _repository.Delete(request.Id);
        }
    }
}