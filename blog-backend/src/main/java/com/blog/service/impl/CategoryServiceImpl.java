package com.blog.service.impl;

import com.blog.dto.CategoryDTO;
import com.blog.entity.Category;
import com.blog.exception.BlogException;
import com.blog.repository.ArticleRepository;
import com.blog.repository.CategoryRepository;
import com.blog.service.CategoryService;
import com.blog.vo.CategoryVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 分类服务实现类
 */
@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Override
    @Transactional
    public CategoryVO createCategory(CategoryDTO categoryDTO) {
        // 检查分类名称是否已存在
        if (categoryRepository.existsByName(categoryDTO.getName())) {
            throw new BlogException("分类名称已存在");
        }

        // 创建分类
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
        category.setSort(categoryDTO.getSort() != null ? categoryDTO.getSort() : 0);
        category.setStatus(categoryDTO.getStatus() != null ? categoryDTO.getStatus() : 1);

        // 保存分类
        categoryRepository.save(category);

        return convertToVO(category, 0L);
    }

    @Override
    @Transactional
    public CategoryVO updateCategory(Long id, CategoryDTO categoryDTO) {
        // 查询分类
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BlogException("分类不存在"));

        // 检查分类名称是否已存在
        if (categoryDTO.getName() != null && !categoryDTO.getName().equals(category.getName())) {
            if (categoryRepository.existsByNameAndIdNot(categoryDTO.getName(), id)) {
                throw new BlogException("分类名称已存在");
            }
            category.setName(categoryDTO.getName());
        }

        // 更新分类
        if (categoryDTO.getDescription() != null) {
            category.setDescription(categoryDTO.getDescription());
        }
        if (categoryDTO.getSort() != null) {
            category.setSort(categoryDTO.getSort());
        }
        if (categoryDTO.getStatus() != null) {
            category.setStatus(categoryDTO.getStatus());
        }

        // 保存分类
        categoryRepository.save(category);

        // 获取文章数量
        Long articleCount = articleRepository.countByCategoryId(id);

        return convertToVO(category, articleCount);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        // 查询分类
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BlogException("分类不存在"));

        // 检查分类下是否有文章
        Long articleCount = articleRepository.countByCategoryId(id);
        if (articleCount > 0) {
            throw new BlogException("该分类下有文章，无法删除");
        }

        // 删除分类
        categoryRepository.delete(category);
    }

    @Override
    public CategoryVO getCategory(Long id) {
        // 查询分类
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BlogException("分类不存在"));

        // 获取文章数量
        Long articleCount = articleRepository.countByCategoryId(id);

        return convertToVO(category, articleCount);
    }

    @Override
    public List<CategoryVO> getAllCategories() {
        // 查询所有可用分类
        List<Category> categoryList = categoryRepository.findByStatus(1, Sort.by(Sort.Direction.ASC, "sort"));

        // 批量获取所有分类的文章数量，避免N+1查询
        List<Long> categoryIds = categoryList.stream()
                .map(Category::getId)
                .collect(Collectors.toList());
        
        // 使用一次查询获取所有分类的文章数量
        List<Object[]> articleCounts = articleRepository.countArticlesByCategoryIds(categoryIds);
        
        // 将结果转换为Map，便于查找
        Map<Long, Long> articleCountMap = articleCounts.stream()
                .collect(Collectors.toMap(
                    result -> (Long) result[0], // categoryId
                    result -> (Long) result[1]  // count
                ));

        // 转换为VO
        return categoryList.stream()
                .map(category -> {
                    Long articleCount = articleCountMap.getOrDefault(category.getId(), 0L);
                    return convertToVO(category, articleCount);
                })
                .collect(Collectors.toList());
    }

    /**
     * 将分类实体转换为VO
     *
     * @param category     分类实体
     * @param articleCount 文章数量
     * @return 分类VO
     */
    private CategoryVO convertToVO(Category category, Long articleCount) {
        return CategoryVO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .sort(category.getSort())
                .status(category.getStatus())
                .articleCount(articleCount)
                .createTime(category.getCreateTime())
                .updateTime(category.getUpdateTime())
                .build();
    }
}