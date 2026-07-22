package com.aleprojects.tasktracker.repository;

import com.aleprojects.tasktracker.model.entity.Category;
import com.aleprojects.tasktracker.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByUserOrderByName(User user);
}
