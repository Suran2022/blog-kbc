package com.blog.repository;

import com.blog.entity.Category;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 分类数据访问接口
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * 根据状态查询分类列表
     *
     * @param status 状态
     * @param sort   排序
     * @return 分类列表
     */
    List<Category> findByStatus(Integer status, Sort sort);

    /**
     * 判断分类名称是否存在
     *
     * @param name 分类名称
     * @return 是否存在
     */
    boolean existsByName(String name);

    /**
     * 判断分类名称是否存在（排除指定ID）
     *
     * @param name 分类名称
     * @param id   分类ID
     * @return 是否存在
     */
    boolean existsByNameAndIdNot(String name, Long id);
}