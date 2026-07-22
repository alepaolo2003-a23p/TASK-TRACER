package com.aleprojects.tasktracker.dto;

import com.aleprojects.tasktracker.model.enums.Priority;
import com.aleprojects.tasktracker.model.enums.TaskStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class TaskResponse {

    private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private LocalDate dueDate;
    private UUID categoryId;
    private String categoryName;
    private String categoryColor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean recurring;
    private String recurrenceRule;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getCategoryColor() { return categoryColor; }
    public void setCategoryColor(String categoryColor) { this.categoryColor = categoryColor; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public boolean isRecurring() { return recurring; }
    public void setRecurring(boolean recurring) { this.recurring = recurring; }
    public String getRecurrenceRule() { return recurrenceRule; }
    public void setRecurrenceRule(String recurrenceRule) { this.recurrenceRule = recurrenceRule; }
}
