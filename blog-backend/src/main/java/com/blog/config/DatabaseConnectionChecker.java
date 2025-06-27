package com.blog.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * 数据库连接检查器
 * 在应用启动时验证数据库连接是否正常
 */
@Component
public class DatabaseConnectionChecker implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConnectionChecker.class);

    @Autowired
    private DataSource dataSource;

    @Autowired
    private Environment env;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("正在检查数据库连接...");
        log.info("数据库URL: {}", env.getProperty("spring.datasource.url"));
        log.info("数据库用户名: {}", env.getProperty("spring.datasource.username"));
        
        try (Connection conn = dataSource.getConnection()) {
            log.info("数据库连接成功: {}", conn.getMetaData().getURL());
            log.info("数据库类型: {}", conn.getMetaData().getDatabaseProductName());
            log.info("数据库版本: {}", conn.getMetaData().getDatabaseProductVersion());
            
            // 测试简单查询
            try {
                Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
                log.info("数据库查询测试成功: {}", result);
            } catch (Exception e) {
                log.error("数据库查询测试失败", e);
            }
            
        } catch (SQLException e) {
            log.error("数据库连接失败", e);
            log.error("SQL状态: {}", e.getSQLState());
            log.error("错误代码: {}", e.getErrorCode());
            log.error("错误信息: {}", e.getMessage());
            
            // 检查是否是访问权限问题
            if (e.getMessage().contains("Access denied") || e.getMessage().contains("拒绝访问")) {
                log.error("可能是数据库用户名或密码错误，请检查配置");
            }
            
            // 检查是否是连接问题
            if (e.getMessage().contains("Communications link failure") || 
                e.getMessage().contains("Connection refused")) {
                log.error("无法连接到数据库服务器，请确保MySQL服务已启动");
            }
            
            // 检查是否是数据库不存在问题
            if (e.getMessage().contains("Unknown database") || 
                e.getMessage().contains("未知数据库")) {
                log.error("数据库不存在，请先创建数据库");
                log.info("可以使用以下SQL创建数据库: CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
            }
        }
    }
}