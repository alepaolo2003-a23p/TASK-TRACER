package com.aleprojects.tasktracker.controller;

import com.aleprojects.tasktracker.dto.StatusRequest;
import com.aleprojects.tasktracker.dto.TaskRequest;
import com.aleprojects.tasktracker.dto.TaskResponse;
import com.aleprojects.tasktracker.model.enums.Priority;
import com.aleprojects.tasktracker.model.enums.TaskStatus;
import com.aleprojects.tasktracker.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(Authentication auth,
                                                          @RequestParam(required = false) TaskStatus status,
                                                          @RequestParam(required = false) Priority priority,
                                                          @RequestParam(required = false) UUID categoryId,
                                                          @RequestParam(required = false) String search) {
        UUID userId = (UUID) auth.getPrincipal();

        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(taskService.searchTasks(userId, search));
        }
        if (status != null || priority != null || categoryId != null) {
            return ResponseEntity.ok(taskService.getFilteredTasks(userId, status, priority, categoryId));
        }
        return ResponseEntity.ok(taskService.getAllTasks(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(Authentication auth, @PathVariable UUID id) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(taskService.getTaskById(userId, id));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(Authentication auth, @Valid @RequestBody TaskRequest request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(Authentication auth, @PathVariable UUID id,
                                                   @Valid @RequestBody TaskRequest request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(taskService.updateTask(userId, id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(Authentication auth, @PathVariable UUID id,
                                                      @RequestBody StatusRequest request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(taskService.updateTaskStatus(userId, id, request.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(Authentication auth, @PathVariable UUID id) {
        UUID userId = (UUID) auth.getPrincipal();
        taskService.deleteTask(userId, id);
        return ResponseEntity.noContent().build();
    }
}
