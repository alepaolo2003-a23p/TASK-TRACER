package com.aleprojects.tasktracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CategoryRequest {

    @NotBlank
    @Size(max = 50)
    private String name;

    @NotBlank
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$")
    private String color;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
