package tn.startchange.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import tn.startchange.dto.TaskDTO;
import tn.startchange.entity.Task;
import tn.startchange.entity.TodoList;
import tn.startchange.entity.User;
import tn.startchange.repository.TaskRepository;
import tn.startchange.repository.TodoListRepository;

@Service
public class TaskService {
	private final TaskRepository taskRepository;
	private final TodoListRepository todoListRepository;

	public TaskService(TaskRepository taskRepository, TodoListRepository todoListRepository) {
		this.taskRepository = taskRepository;
		this.todoListRepository = todoListRepository;
	}

	private User getCurrentUser() {
		return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}

	public List<TaskDTO> getAllForTodoList(Long todoListId) {
		TodoList todoList = todoListRepository.findById(todoListId)
				.orElseThrow(() -> new RuntimeException("TodoList not found"));
		if (!todoList.getUser().getId().equals(getCurrentUser().getId())) {
			throw new RuntimeException("Not authorized");
		}
		return taskRepository.findByTodoListId(todoListId).stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	public TaskDTO create(Long todoListId, TaskDTO dto) {
		TodoList todoList = todoListRepository.findById(todoListId)
				.orElseThrow(() -> new RuntimeException("TodoList not found"));
		if (!todoList.getUser().getId().equals(getCurrentUser().getId())) {
			throw new RuntimeException("Not authorized");
		}
		Task task = new Task(dto.getTitle(), dto.getDescription(), dto.getDueDate(), dto.getStatus(), dto.getPriority(),
				todoList);
		Task saved = taskRepository.save(task);
		return mapToDTO(saved);
	}

	public TaskDTO update(Long id, TaskDTO dto) {
		Task existing = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
		if (!existing.getTodoList().getUser().getId().equals(getCurrentUser().getId())) {
			throw new RuntimeException("Not authorized");
		}
		existing.setTitle(dto.getTitle());
		existing.setDescription(dto.getDescription());
		existing.setDueDate(dto.getDueDate());
		existing.setStatus(dto.getStatus());
		existing.setPriority(dto.getPriority());
		Task updated = taskRepository.save(existing);
		return mapToDTO(updated);
	}

	public void delete(Long id) {
		Task existing = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
		if (!existing.getTodoList().getUser().getId().equals(getCurrentUser().getId())) {
			throw new RuntimeException("Not authorized");
		}
		taskRepository.delete(existing);
	}

	private TaskDTO mapToDTO(Task entity) {
		TaskDTO dto = new TaskDTO();
		dto.setId(entity.getId());
		dto.setTitle(entity.getTitle());
		dto.setDescription(entity.getDescription());
		dto.setDueDate(entity.getDueDate());
		dto.setStatus(entity.getStatus());
		dto.setPriority(entity.getPriority());
		return dto;
	}
}
