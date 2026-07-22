package com.aleprojects.tasktracker.repository;

import com.aleprojects.tasktracker.model.entity.Task;
import com.aleprojects.tasktracker.model.entity.User;
import com.aleprojects.tasktracker.model.enums.Priority;
import com.aleprojects.tasktracker.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByUserOrderByCreatedAtDesc(User user);

    List<Task> findByUserAndStatus(User user, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.user = :user AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:categoryId IS NULL OR t.category.id = :categoryId)")
    List<Task> findByFilters(@Param("user") User user,
                             @Param("status") TaskStatus status,
                             @Param("priority") Priority priority,
                             @Param("categoryId") UUID categoryId);

    @Query("SELECT t FROM Task t WHERE t.user = :user AND " +
           "LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Task> searchByText(@Param("user") User user, @Param("query") String query);
}
