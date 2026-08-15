using System;
using System.Collections.Generic;
using System.Linq;
using ToDoListApp.Persistence; 

namespace ToDoListApp.Entities.Repositories
{
    public class ToDoRepository : IToDoRepository
    {
        private readonly ToDoDbContext _context;

        public ToDoRepository(ToDoDbContext context)
        {
            _context = context;
        }

        public List<ToDo> GetAll()  
            => _context.ToDos.ToList();

        public ToDo GetById(Guid id)
            => _context.ToDos.FirstOrDefault(x => x.Id == id);

        public void Add(ToDo entity)
        {
            _context.ToDos.Add(entity);
            _context.SaveChanges();
        }

        public void Update(ToDo entity)
        {
            _context.ToDos.Update(entity);
            _context.SaveChanges();
        }
        
        public void Delete(Guid id)
        {
            var item = GetById(id);
            if (item != null)
            {
                _context.ToDos.Remove(item);
                _context.SaveChanges();
            }
        }
    }
}

