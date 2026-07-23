package com.aleprojects.tasktracker.dto;

import com.aleprojects.tasktracker.model.enums.TaskStatus;

public class StatusRequest {

    private TaskStatus status;

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
}
