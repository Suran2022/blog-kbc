package com.blog.controller;

import com.blog.common.Result;
import com.blog.dto.CategoryDTO;
import com.blog.service.CategoryService;
import com.blog.vo.CategoryVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类控制器
 */
@Tag(name = "分类管理", description = "分类相关接口")
@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    /**
     * 创建分类
     *
     * @param categoryDTO 分类信息
     * @return 创建结果
     */
    @Operation(summary = "创建分类", description = "创建新分类")
    @PostMapping
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("isAuthenticated()")
    public Result<CategoryVO> createCategory(@Validated @RequestBody CategoryDTO categoryDTO) {
        CategoryVO categoryVO = categoryService.createCategory(categoryDTO);
        return Result.success(categoryVO);
    }

    /**
     * 更新分类
     *
     * @param id          分类ID
     * @param categoryDTO 分类信息
     * @return 更新结果
     */
    @Operation(summary = "更新分类", description = "根据ID更新分类信息")
    @PutMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("isAuthenticated()")
    public Result<CategoryVO> updateCategory(@PathVariable Long id, @Validated @RequestBody CategoryDTO categoryDTO) {
        CategoryVO categoryVO = categoryService.updateCategory(id, categoryDTO);
        return Result.success(categoryVO);
    }

    /**
     * 删除分类
     *
     * @param id 分类ID
     * @return 删除结果
     */
    @Operation(summary = "删除分类", description = "根据ID删除分类")
    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("isAuthenticated()")
    public Result<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return Result.success();
    }

    /**
     * 获取分类详情
     *
     * @param id 分类ID
     * @return 分类详情
     */
    @Operation(summary = "获取分类详情", description = "根据ID获取分类详细信息")
    @GetMapping("/{id}")
    public Result<CategoryVO> getCategory(@PathVariable Long id) {
        CategoryVO categoryVO = categoryService.getCategory(id);
        return Result.success(categoryVO);
    }

    /**
     * 获取所有分类
     *
     * @return 分类列表
     */
    @Operation(summary = "获取所有分类", description = "获取所有可用的分类列表")
    @GetMapping
    public Result<List<CategoryVO>> getAllCategories() {
        List<CategoryVO> categoryVOList = categoryService.getAllCategories();
        return Result.success(categoryVOList);
    }
}