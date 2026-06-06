package com.reportit.usermgmt.category;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.entity.Category;
import com.reportit.usermgmt.repository.CategoryRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        String name = cleanName(request.getName());
        categoryRepository.findByNameIgnoreCase(name).ifPresent(existing -> {
            throw new ApiException("Category already exists", HttpStatus.BAD_REQUEST);
        });
        return toResponse(categoryRepository.save(Category.builder().name(name).build()));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = getCategory(id);
        String name = cleanName(request.getName());
        categoryRepository.findByNameIgnoreCase(name)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new ApiException("Category already exists", HttpStatus.BAD_REQUEST);
                });
        category.setName(name);
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ApiException("Category not found", HttpStatus.NOT_FOUND);
        }
        categoryRepository.deleteById(id);
    }

    private Category getCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException("Category not found", HttpStatus.NOT_FOUND));
    }

    private String cleanName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new ApiException("Category name is required", HttpStatus.BAD_REQUEST);
        }
        return name.trim();
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }

    @Data
    public static class CategoryRequest {
        private String name;
    }

    @Data
    @Builder
    public static class CategoryResponse {
        private Long id;
        private String name;
    }
}
