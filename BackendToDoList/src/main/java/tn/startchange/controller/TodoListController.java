package tn.startchange.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tn.startchange.dto.TodoListDTO;
import tn.startchange.service.TodoListService;

@RestController
@RequestMapping("/api/todolists")
public class TodoListController {
	private final TodoListService todoListService;

	public TodoListController(TodoListService todoListService) {
		this.todoListService = todoListService;
	}

	@GetMapping
	public ResponseEntity<List<TodoListDTO>> getAll() {
		return ResponseEntity.ok(todoListService.getAllForCurrentUser());
	}

	@PostMapping
	public ResponseEntity<TodoListDTO> create(@RequestBody TodoListDTO dto) {
		return ResponseEntity.ok(todoListService.create(dto));
	}

	@PutMapping("/{id}")
	public ResponseEntity<TodoListDTO> update(@PathVariable Long id, @RequestBody TodoListDTO dto) {
		return ResponseEntity.ok(todoListService.update(id, dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		todoListService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
