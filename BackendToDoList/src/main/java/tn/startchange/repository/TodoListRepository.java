package tn.startchange.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.startchange.entity.TodoList;

@Repository
public interface TodoListRepository extends JpaRepository<TodoList, Long> {
	List<TodoList> findByUserId(Long userId);
}
