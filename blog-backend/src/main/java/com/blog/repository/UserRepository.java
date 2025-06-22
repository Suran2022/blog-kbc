package com.blog.repository;

import com.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户数据访问接口
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 根据用户名查询用户
     *
     * @param username 用户名
     * @return 用户信息
     */
    Optional<User> findByUsername(String username);

    /**
     * 根据用户名和状态查询用户
     *
     * @param username 用户名
     * @param status   状态
     * @return 用户信息
     */
    Optional<User> findByUsernameAndStatus(String username, Integer status);

    /**
     * 判断用户名是否存在
     *
     * @param username 用户名
     * @return 是否存在
     */
    boolean existsByUsername(String username);

    /**
     * 判断邮箱是否存在
     *
     * @param email 邮箱
     * @return 是否存在
     */
    boolean existsByEmail(String email);

    /**
     * 判断邮箱是否存在（排除指定ID）
     *
     * @param email 邮箱
     * @param id    用户ID
     * @return 是否存在
     */
    boolean existsByEmailAndIdNot(String email, Long id);
}