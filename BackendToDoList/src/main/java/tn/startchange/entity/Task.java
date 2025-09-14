package tn.startchange.entity;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import tn.staetchange.enums.TaskPriority;
import tn.staetchange.enums.TaskStatus;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
@Table(name = "t_tasks")
public class Task implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@Column(nullable = false)
	private String title;

	private String description;

	private LocalDate dueDate;

	@Enumerated(EnumType.STRING) 
	private TaskStatus status = TaskStatus.PENDING; 

	@Enumerated(EnumType.STRING)
	private TaskPriority priority = TaskPriority.MEDIUM; 

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "todo_list_id", nullable = false)
	private TodoList todoList;

	public Task(String title, String description, LocalDate dueDate, TaskStatus status, TaskPriority priority,
			TodoList todoList) {
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.status = status;
		this.priority = priority;
		this.todoList = todoList;
	}
}
