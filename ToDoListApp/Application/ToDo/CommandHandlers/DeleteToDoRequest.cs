using System;

namespace ToDoListApp.Application.ToDo.CommandHandlers
{
    public class DeleteToDoRequest
    {
        public Guid Id { get; set; }
    }
}