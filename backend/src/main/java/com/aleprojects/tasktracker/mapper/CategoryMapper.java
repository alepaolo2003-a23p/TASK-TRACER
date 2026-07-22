package com.aleprojects.tasktracker.mapper;

import com.aleprojects.tasktracker.dto.CategoryRequest;
import com.aleprojects.tasktracker.dto.CategoryResponse;
import com.aleprojects.tasktracker.model.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        CategoryResponse resp = new CategoryResponse();
        resp.setId(category.getId());
        resp.setName(category.getName());
        resp.setColor(category.getColor());
        return resp;
    }

    public Category toEntity(CategoryRequest request) {
        return new Category(request.getName(), request.getColor(), null);
    }

    public void updateEntity(Category category, CategoryRequest request) {
        category.setName(request.getName());
        category.setColor(request.getColor());
    }
}
