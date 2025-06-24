-- Migration: 20231201005
-- Description: Create logs and statistics tables
-- Created: 2023-12-01 12:00:00
-- Author: System

-- UP
-- 创建操作日志表
CREATE TABLE IF NOT EXISTS operation_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    username VARCHAR(50),
    operation VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    request_method VARCHAR(10),
    request_url VARCHAR(500),
    request_params LONGTEXT,
    response_status INT,
    response_time INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_operation (operation),
    INDEX idx_module (module),
    INDEX idx_ip_address (ip_address),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建登录日志表
CREATE TABLE IF NOT EXISTS login_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    username VARCHAR(50),
    login_type ENUM('PASSWORD', 'OAUTH', 'TOKEN') DEFAULT 'PASSWORD',
    login_status ENUM('SUCCESS', 'FAILED', 'BLOCKED') NOT NULL,
    failure_reason VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    location VARCHAR(100),
    device_info JSON,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_username (username),
    INDEX idx_login_status (login_status),
    INDEX idx_ip_address (ip_address),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建访问统计表
CREATE TABLE IF NOT EXISTS visit_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    page_url VARCHAR(500),
    page_title VARCHAR(255),
    visit_count INT DEFAULT 0,
    unique_visitor_count INT DEFAULT 0,
    bounce_count INT DEFAULT 0,
    avg_duration INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_date_url (stat_date, page_url),
    INDEX idx_stat_date (stat_date),
    INDEX idx_page_url (page_url)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建访客统计表
CREATE TABLE IF NOT EXISTS visitor_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referer VARCHAR(500),
    country VARCHAR(50),
    region VARCHAR(50),
    city VARCHAR(50),
    device_type ENUM('DESKTOP', 'MOBILE', 'TABLET', 'BOT') DEFAULT 'DESKTOP',
    browser VARCHAR(50),
    os VARCHAR(50),
    visit_count INT DEFAULT 1,
    page_count INT DEFAULT 1,
    duration INT DEFAULT 0,
    first_visit_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_visit_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_date_ip (stat_date, ip_address),
    INDEX idx_stat_date (stat_date),
    INDEX idx_ip_address (ip_address),
    INDEX idx_device_type (device_type),
    INDEX idx_country (country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建搜索统计表
CREATE TABLE IF NOT EXISTS search_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    search_count INT DEFAULT 1,
    result_count INT DEFAULT 0,
    click_count INT DEFAULT 0,
    last_searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_keyword (keyword),
    INDEX idx_search_count (search_count),
    INDEX idx_last_searched_at (last_searched_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建错误日志表
CREATE TABLE IF NOT EXISTS error_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    error_stack LONGTEXT,
    request_url VARCHAR(500),
    request_method VARCHAR(10),
    request_params LONGTEXT,
    user_id BIGINT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    status ENUM('NEW', 'INVESTIGATING', 'RESOLVED', 'IGNORED') DEFAULT 'NEW',
    resolved_at TIMESTAMP NULL,
    resolved_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_error_type (error_type),
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建邮件发送记录表
CREATE TABLE IF NOT EXISTS email_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    cc_email VARCHAR(500),
    bcc_email VARCHAR(500),
    subject VARCHAR(255) NOT NULL,
    content LONGTEXT,
    template_name VARCHAR(100),
    template_data JSON,
    send_status ENUM('PENDING', 'SENT', 'FAILED', 'BOUNCED') DEFAULT 'PENDING',
    failure_reason TEXT,
    provider VARCHAR(50),
    message_id VARCHAR(255),
    sent_at TIMESTAMP NULL,
    opened_at TIMESTAMP NULL,
    clicked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_to_email (to_email),
    INDEX idx_send_status (send_status),
    INDEX idx_template_name (template_name),
    INDEX idx_sent_at (sent_at),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建系统监控表
CREATE TABLE IF NOT EXISTS system_monitors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    monitor_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    disk_usage DECIMAL(5,2),
    network_in BIGINT DEFAULT 0,
    network_out BIGINT DEFAULT 0,
    active_connections INT DEFAULT 0,
    response_time INT DEFAULT 0,
    error_count INT DEFAULT 0,
    warning_count INT DEFAULT 0,
    status ENUM('NORMAL', 'WARNING', 'ERROR', 'CRITICAL') DEFAULT 'NORMAL',
    
    INDEX idx_monitor_time (monitor_time),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建定时任务日志表
CREATE TABLE IF NOT EXISTS scheduled_task_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    task_class VARCHAR(255),
    task_method VARCHAR(100),
    task_params JSON,
    execution_status ENUM('RUNNING', 'SUCCESS', 'FAILED', 'TIMEOUT') NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    execution_time INT DEFAULT 0,
    result_message TEXT,
    error_message TEXT,
    error_stack LONGTEXT,
    server_name VARCHAR(100),
    
    INDEX idx_task_name (task_name),
    INDEX idx_execution_status (execution_status),
    INDEX idx_start_time (start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建API调用统计表
CREATE TABLE IF NOT EXISTS api_call_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    api_path VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    call_count INT DEFAULT 1,
    success_count INT DEFAULT 0,
    error_count INT DEFAULT 0,
    avg_response_time INT DEFAULT 0,
    max_response_time INT DEFAULT 0,
    min_response_time INT DEFAULT 0,
    last_called_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stat_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_api_date (api_path, http_method, stat_date),
    INDEX idx_api_path (api_path),
    INDEX idx_stat_date (stat_date),
    INDEX idx_last_called_at (last_called_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DOWN
DROP TABLE IF EXISTS api_call_stats;
DROP TABLE IF EXISTS scheduled_task_logs;
DROP TABLE IF EXISTS system_monitors;
DROP TABLE IF EXISTS email_logs;
DROP TABLE IF EXISTS error_logs;
DROP TABLE IF EXISTS search_stats;
DROP TABLE IF EXISTS visitor_stats;
DROP TABLE IF EXISTS visit_stats;
DROP TABLE IF EXISTS login_logs;
DROP TABLE IF EXISTS operation_logs;