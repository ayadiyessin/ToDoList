package tn.startchange.dto;

import java.time.LocalDate;

import lombok.Data;
import tn.staetchange.enums.TaskPriority;
import tn.staetchange.enums.TaskStatus;

@Data
public class TaskDTO {
	private Long id;
	private String title;
	private String description;
	private LocalDate dueDate;
	private TaskStatus status;
	private TaskPriority priority;
}
