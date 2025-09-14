package tn.startchange.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TodoListDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate createdAt;
}
