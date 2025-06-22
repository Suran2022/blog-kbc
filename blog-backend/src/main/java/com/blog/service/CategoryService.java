package com.blog.service;

import com.blog.dto.CategoryDTO;
import com.blog.vo.CategoryVO;

import java.util.List;

/**
 * 分类服务接口
 */
public interface CategoryService {

    /**
     * 创建分类
     *
     * @param categoryDTO 分类信息
     * @return 创建的分类
     */
    CategoryVO createCategory(CategoryDTO categoryDTO);

    /**
     * 更新分类
     *
     * @param id          分类ID
     * @param categoryDTO 分类信息
     * @return 更新后的分类
     */
    CategoryVO updateCategory(Long id, CategoryDTO categoryDTO);

    /**
     * 删除分类
     *
     * @param id 分类ID
     */
    void deleteCategory(Long id);

    /**
     * 获取分类详情
     *
     * @param id 分类ID
     * @return 分类详情
     */
    CategoryVO getCategory(Long id);

    /**
     * 获取所有分类
     *
     * @return 分类列表
     */
    List<CategoryVO> getAllCategories();
}