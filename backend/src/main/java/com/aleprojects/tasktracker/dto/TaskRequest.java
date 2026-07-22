package com.aleprojects.tasktracker.dto;

import com.aleprojects.tasktracker.model.enums.Priority;
import com.aleprojects.tasktracker.model.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

public class TaskRequest {

    @NotBlank
    @Size(max = 150)
    private String title;

    private String description;

    @NotNull
    private TaskStatus status;

    @NotNull
    private Priority priority;

    private LocalDate dueDate;

    private UUID categoryId;

    private boolean recurring;

    private String recurrenceRule;

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
    public boolean isRecurring() { return recurring; }
    public void setRecurring(boolean recurring) { this.recurring = recurring; }
    public String getRecurrenceRule() { return recurrenceRule; }
    public void setRecurrenceRule(String recurrenceRule) { this.recurrenceRule = recurrenceRule; }
}
