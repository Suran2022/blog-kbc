package com.blog.repository;

import com.blog.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 系统设置数据访问接口
 */
@Repository
public interface SettingRepository extends JpaRepository<Setting, Long> {

    /**
     * 获取第一条系统设置
     *
     * @return 系统设置
     */
    Optional<Setting> findFirstByOrderById();
}