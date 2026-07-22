package com.aleprojects.tasktracker.service;

import com.aleprojects.tasktracker.dto.CategoryRequest;
import com.aleprojects.tasktracker.dto.CategoryResponse;
import com.aleprojects.tasktracker.exception.ResourceNotFoundException;
import com.aleprojects.tasktracker.mapper.CategoryMapper;
import com.aleprojects.tasktracker.model.entity.Category;
import com.aleprojects.tasktracker.model.entity.User;
import com.aleprojects.tasktracker.repository.CategoryRepository;
import com.aleprojects.tasktracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository,
                           UserRepository userRepository,
                           CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.categoryMapper = categoryMapper;
    }

    public List<CategoryResponse> getAllCategories(UUID userId) {
        User user = getUser(userId);
        return categoryRepository.findByUserOrderByName(user).stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    public CategoryResponse createCategory(UUID userId, CategoryRequest request) {
        User user = getUser(userId);
        Category category = categoryMapper.toEntity(request);
        category.setUser(user);
        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    public CategoryResponse updateCategory(UUID userId, UUID categoryId, CategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId));
        validateOwnership(category, userId);
        categoryMapper.updateEntity(category, request);
        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    public void deleteCategory(UUID userId, UUID categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId));
        validateOwnership(category, userId);
        categoryRepository.delete(category);
    }

    private User getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }

    private void validateOwnership(Category category, UUID userId) {
        if (!category.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Category", category.getId());
        }
    }
}
