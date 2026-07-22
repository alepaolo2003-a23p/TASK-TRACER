package com.aleprojects.tasktracker.service;

import com.aleprojects.tasktracker.dto.TaskRequest;
import com.aleprojects.tasktracker.dto.TaskResponse;
import com.aleprojects.tasktracker.exception.ResourceNotFoundException;
import com.aleprojects.tasktracker.mapper.TaskMapper;
import com.aleprojects.tasktracker.model.entity.Category;
import com.aleprojects.tasktracker.model.entity.Task;
import com.aleprojects.tasktracker.model.entity.User;
import com.aleprojects.tasktracker.model.enums.Priority;
import com.aleprojects.tasktracker.model.enums.TaskStatus;
import com.aleprojects.tasktracker.repository.CategoryRepository;
import com.aleprojects.tasktracker.repository.TaskRepository;
import com.aleprojects.tasktracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    public TaskService(TaskRepository taskRepository,
                       CategoryRepository categoryRepository,
                       UserRepository userRepository,
                       TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.taskMapper = taskMapper;
    }

    public List<TaskResponse> getAllTasks(UUID userId) {
        User user = getUser(userId);
        return taskRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    public List<TaskResponse> getFilteredTasks(UUID userId, TaskStatus status, Priority priority, UUID categoryId) {
        User user = getUser(userId);
        return taskRepository.findByFilters(user, status, priority, categoryId).stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    public List<TaskResponse> searchTasks(UUID userId, String query) {
        User user = getUser(userId);
        return taskRepository.searchByText(user, query).stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    public TaskResponse getTaskById(UUID userId, UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));
        validateOwnership(task, userId);
        return taskMapper.toResponse(task);
    }

    public TaskResponse createTask(UUID userId, TaskRequest request) {
        User user = getUser(userId);
        Category category = request.getCategoryId() != null
                ? categoryRepository.findById(request.getCategoryId()).orElse(null)
                : null;

        Task task = taskMapper.toEntity(request, category);
        task.setUser(user);
        task = taskRepository.save(task);
        return taskMapper.toResponse(task);
    }

    public TaskResponse updateTask(UUID userId, UUID taskId, TaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));
        validateOwnership(task, userId);

        Category category = request.getCategoryId() != null
                ? categoryRepository.findById(request.getCategoryId()).orElse(null)
                : null;

        taskMapper.updateEntity(task, request, category);
        task = taskRepository.save(task);
        return taskMapper.toResponse(task);
    }

    public void deleteTask(UUID userId, UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));
        validateOwnership(task, userId);
        taskRepository.delete(task);
    }

    public TaskResponse updateTaskStatus(UUID userId, UUID taskId, TaskStatus newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));
        validateOwnership(task, userId);
        task.setStatus(newStatus);
        task = taskRepository.save(task);
        return taskMapper.toResponse(task);
    }

    private User getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }

    private void validateOwnership(Task task, UUID userId) {
        if (!task.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task", task.getId());
        }
    }
}
