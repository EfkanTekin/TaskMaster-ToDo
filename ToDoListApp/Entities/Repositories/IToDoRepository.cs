using System;
using System.Collections.Generic;

namespace ToDoListApp.Entities.Repositories
{
    public interface IToDoRepository
    {
        List<ToDo> GetAll();
        ToDo GetById(Guid id);
        void Add(ToDo entity);
        void Update(ToDo entity);
        void Delete(Guid id);
    }
}

    