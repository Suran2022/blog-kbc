package com.blog.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * 缓存配置类
 * 配置应用级缓存，提升数据访问性能
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * 配置缓存管理器
     * 使用内存缓存，适合开发和小规模应用
     */
    @Bean
    @Primary
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        // 设置缓存名称
        cacheManager.setCacheNames(java.util.Arrays.asList(
            "articles",           // 文章缓存
            "categories",        // 分类缓存
            "tags",              // 标签缓存
            "popularArticles",   // 热门文章缓存
            "searchSuggestions", // 搜索建议缓存
            "userProfiles"       // 用户资料缓存
        ));
        // 允许空值缓存
        cacheManager.setAllowNullValues(true);
        return cacheManager;
    }
}