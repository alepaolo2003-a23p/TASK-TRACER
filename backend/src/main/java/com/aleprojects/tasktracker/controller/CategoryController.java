package com.aleprojects.tasktracker.controller;

import com.aleprojects.tasktracker.dto.CategoryRequest;
import com.aleprojects.tasktracker.dto.CategoryResponse;
import com.aleprojects.tasktracker.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(categoryService.getAllCategories(userId));
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(Authentication auth,
                                                           @Valid @RequestBody CategoryRequest request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(Authentication auth, @PathVariable UUID id,
                                                           @Valid @RequestBody CategoryRequest request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(categoryService.updateCategory(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(Authentication auth, @PathVariable UUID id) {
        UUID userId = (UUID) auth.getPrincipal();
        categoryService.deleteCategory(userId, id);
        return ResponseEntity.noContent().build();
    }
}
