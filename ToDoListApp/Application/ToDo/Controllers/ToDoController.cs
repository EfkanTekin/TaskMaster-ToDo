using Microsoft.AspNetCore.Mvc;
using System;
using ToDoListApp.Application.ToDo.CommandHandlers;
using ToDoListApp.Application.ToDo.QueryHandlers;

namespace ToDoListApp.Application.ToDo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToDoController : ControllerBase
    {
        private readonly CreateToDoCommandHandler _createHandler;
        private readonly UpdateToDoCommandHandler _updateHandler;
        private readonly DeleteToDoCommandHandler _deleteHandler;
        private readonly GetAllToDosQueryHandler _getAllHandler;
        private readonly GetToDoByIdQueryHandler _getByIdHandler;

        public ToDoController(
            CreateToDoCommandHandler createHandler,
            UpdateToDoCommandHandler updateHandler,
            DeleteToDoCommandHandler deleteHandler,
            GetAllToDosQueryHandler getAllHandler,
            GetToDoByIdQueryHandler getByIdHandler)
        {
            _createHandler = createHandler;
            _updateHandler = updateHandler;
            _deleteHandler = deleteHandler;
            _getAllHandler = getAllHandler;
            _getByIdHandler = getByIdHandler;
        }


        [HttpGet]
        public IActionResult GetAll()
        {
            var result = _getAllHandler.Handle(new GetAllToDosRequest()); 
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            var request = new GetToDoByIdRequest { Id = id }; 
            var result = _getByIdHandler.Handle(request);
            if (result == null) return NotFound();
            return Ok(result);
        }


        [HttpPost]
        public IActionResult Create([FromBody] CreateToDoRequest request)
        {
            _createHandler.Handle(request);
            return Ok();
        }

        
        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromBody] UpdateToDoRequest request)
        {
            request.Id = id;
            _updateHandler.Handle(request);
            return Ok();
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var request = new DeleteToDoRequest { Id = id }; 
            _deleteHandler.Handle(request);
            return Ok();
        }
    }
}