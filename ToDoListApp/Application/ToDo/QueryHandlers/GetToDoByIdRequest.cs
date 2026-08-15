using System;

namespace ToDoListApp.Application.ToDo.QueryHandlers
{
    public class GetToDoByIdRequest
    {
        public Guid Id { get; set; }
    }
}