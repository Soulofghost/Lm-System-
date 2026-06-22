package com.example.lms.controller;

import com.example.lms.entity.Category;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryRepository categories;

    public CategoryController(CategoryRepository categories) {
        this.categories = categories;
    }

    @GetMapping
    List<Category> all() { return categories.findAll(); }

    @GetMapping("/{id}")
    Category one(@PathVariable Long id) {
        return categories.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    Category create(@Valid @RequestBody Category category) { return categories.save(category); }

    @PutMapping("/{id}")
    Category update(@PathVariable Long id, @Valid @RequestBody Category request) {
        Category category = one(id);
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return categories.save(category);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long id) { categories.delete(one(id)); }
}
