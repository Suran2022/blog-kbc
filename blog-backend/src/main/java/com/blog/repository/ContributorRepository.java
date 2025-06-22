package com.blog.repository;

import com.blog.entity.Contributor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 贡献者数据访问接口
 */
@Repository
public interface ContributorRepository extends JpaRepository<Contributor, Long> {

    /**
     * 根据状态查询贡献者列表
     *
     * @param status 状态
     * @param sort   排序
     * @return 贡献者列表
     */
    List<Contributor> findByStatus(Integer status, Sort sort);

    /**
     * 判断贡献者名称是否存在
     *
     * @param name 贡献者名称
     * @return 是否存在
     */
    boolean existsByName(String name);

    /**
     * 判断贡献者名称是否存在（排除指定ID）
     *
     * @param name 贡献者名称
     * @param id   贡献者ID
     * @return 是否存在
     */
    boolean existsByNameAndIdNot(String name, Long id);
}