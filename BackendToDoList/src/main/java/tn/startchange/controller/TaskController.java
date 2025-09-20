package tn.startchange.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tn.startchange.dto.TaskDTO;
import tn.startchange.service.TaskService;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
	private final TaskService taskService;

	public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}

	@GetMapping("/todolist/{todoListId}")
	public ResponseEntity<List<TaskDTO>> getAllForTodoList(@PathVariable Long todoListId) {
		return ResponseEntity.ok(taskService.getAllForTodoList(todoListId));
	}

	@PostMapping("/todolist/{todoListId}")
	public ResponseEntity<TaskDTO> create(@PathVariable Long todoListId, @RequestBody TaskDTO dto) {
		return ResponseEntity.ok(taskService.create(todoListId, dto));
	}

	@PutMapping("/{id}")
	public ResponseEntity<TaskDTO> update(@PathVariable Long id, @RequestBody TaskDTO dto) {
		return ResponseEntity.ok(taskService.update(id, dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		taskService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
