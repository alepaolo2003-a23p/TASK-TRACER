package com.aleprojects.tasktracker.mapper;

import com.aleprojects.tasktracker.dto.TaskRequest;
import com.aleprojects.tasktracker.dto.TaskResponse;
import com.aleprojects.tasktracker.model.entity.Category;
import com.aleprojects.tasktracker.model.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskResponse toResponse(Task task) {
        TaskResponse resp = new TaskResponse();
        resp.setId(task.getId());
        resp.setTitle(task.getTitle());
        resp.setDescription(task.getDescription());
        resp.setStatus(task.getStatus());
        resp.setPriority(task.getPriority());
        resp.setDueDate(task.getDueDate());
        resp.setCreatedAt(task.getCreatedAt());
        resp.setUpdatedAt(task.getUpdatedAt());
        resp.setRecurring(task.isRecurring());
        resp.setRecurrenceRule(task.getRecurrenceRule());

        if (task.getCategory() != null) {
            resp.setCategoryId(task.getCategory().getId());
            resp.setCategoryName(task.getCategory().getName());
            resp.setCategoryColor(task.getCategory().getColor());
        }

        return resp;
    }

    public Task toEntity(TaskRequest request, Category category) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setCategory(category);
        task.setRecurring(request.isRecurring());
        task.setRecurrenceRule(request.getRecurrenceRule());
        return task;
    }

    public void updateEntity(Task task, TaskRequest request, Category category) {
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setCategory(category);
        task.setRecurring(request.isRecurring());
        task.setRecurrenceRule(request.getRecurrenceRule());
    }
}
