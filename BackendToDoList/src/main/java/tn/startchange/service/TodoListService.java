package tn.startchange.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import tn.startchange.dto.TodoListDTO;
import tn.startchange.entity.TodoList;
import tn.startchange.entity.User;
import tn.startchange.repository.TodoListRepository;

@Service
public class TodoListService {
	private final TodoListRepository todoListRepository;

	public TodoListService(TodoListRepository todoListRepository) {
		this.todoListRepository = todoListRepository;
	}

	private User getCurrentUser() {
		return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}

	public List<TodoListDTO> getAllForCurrentUser() {
		Long userId = getCurrentUser().getId();
		return todoListRepository.findByUserId(userId).stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	public TodoListDTO create(TodoListDTO dto) {
		User user = getCurrentUser();
		TodoList todoList = new TodoList(dto.getTitle(), dto.getDescription(), user);
		TodoList saved = todoListRepository.save(todoList);
		return mapToDTO(saved);
	}

	public TodoListDTO update(Long id, TodoListDTO dto) {
		TodoList existing = todoListRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("TodoList not found"));
		if (!existing.getUser().getId().equals(getCurrentUser().getId())) {
			throw new RuntimeException("Not authorized");
		}
		existing.setTitle(dto.getTitle());
		existing.setDescription(dto.getDescription());
		TodoList updated = todoListRepository.save(existing);
		return mapToDTO(updated);
	}

	public void delete(Long id) {
		TodoList existing = todoListRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("TodoList not found"));
		if (!existing.getUser().getId().equals(getCurrentUser().getId())) {
			throw new RuntimeException("Not authorized");
		}
		todoListRepository.delete(existing);
	}

	private TodoListDTO mapToDTO(TodoList entity) {
		TodoListDTO dto = new TodoListDTO();
		dto.setId(entity.getId());
		dto.setTitle(entity.getTitle());
		dto.setDescription(entity.getDescription());
		dto.setCreatedAt(entity.getCreatedAt());
		return dto;
	}
}