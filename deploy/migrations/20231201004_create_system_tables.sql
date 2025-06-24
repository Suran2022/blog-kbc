-- Migration: 20231201004
-- Description: Create system configuration and media tables
-- Created: 2023-12-01 11:30:00
-- Author: System

-- UP
-- 创建系统配置表
CREATE TABLE IF NOT EXISTS system_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(255) NOT NULL UNIQUE,
    config_value LONGTEXT,
    config_type ENUM('STRING', 'INTEGER', 'BOOLEAN', 'JSON', 'TEXT') DEFAULT 'STRING',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_config_key (config_key),
    INDEX idx_is_public (is_public),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建媒体文件表
CREATE TABLE IF NOT EXISTS media_files (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500),
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_extension VARCHAR(10),
    width INT NULL,
    height INT NULL,
    duration INT NULL,
    file_hash VARCHAR(64),
    storage_type ENUM('LOCAL', 'OSS', 'COS', 'S3') DEFAULT 'LOCAL',
    storage_config JSON,
    uploader_id BIGINT NULL,
    uploader_ip VARCHAR(45),
    usage_count INT DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    status ENUM('ACTIVE', 'DELETED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_filename (filename),
    INDEX idx_file_hash (file_hash),
    INDEX idx_mime_type (mime_type),
    INDEX idx_uploader_id (uploader_id),
    INDEX idx_storage_type (storage_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建友情链接表
CREATE TABLE IF NOT EXISTS friend_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    email VARCHAR(100),
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    sort_order INT DEFAULT 0,
    click_count INT DEFAULT 0,
    is_reciprocal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_sort_order (sort_order),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建页面表
CREATE TABLE IF NOT EXISTS pages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content LONGTEXT NOT NULL,
    content_html LONGTEXT,
    excerpt TEXT,
    featured_image VARCHAR(500),
    template VARCHAR(100) DEFAULT 'default',
    status ENUM('DRAFT', 'PUBLISHED', 'PRIVATE') DEFAULT 'DRAFT',
    visibility ENUM('PUBLIC', 'PRIVATE', 'PASSWORD') DEFAULT 'PUBLIC',
    password VARCHAR(255),
    sort_order INT DEFAULT 0,
    view_count INT DEFAULT 0,
    allow_comments BOOLEAN DEFAULT FALSE,
    show_in_menu BOOLEAN DEFAULT FALSE,
    menu_title VARCHAR(100),
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords VARCHAR(500),
    author_id BIGINT NOT NULL,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_visibility (visibility),
    INDEX idx_sort_order (sort_order),
    INDEX idx_show_in_menu (show_in_menu),
    INDEX idx_author_id (author_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建导航菜单表
CREATE TABLE IF NOT EXISTS navigation_menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建导航菜单项表
CREATE TABLE IF NOT EXISTS navigation_menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    menu_id BIGINT NOT NULL,
    parent_id BIGINT NULL,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(500),
    target VARCHAR(20) DEFAULT '_self',
    icon VARCHAR(50),
    css_class VARCHAR(100),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    object_type ENUM('CUSTOM', 'POST', 'PAGE', 'CATEGORY', 'TAG') DEFAULT 'CUSTOM',
    object_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (menu_id) REFERENCES navigation_menus(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES navigation_menu_items(id) ON DELETE CASCADE,
    INDEX idx_menu_id (menu_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_sort_order (sort_order),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入默认系统配置
INSERT INTO system_config (config_key, config_value, config_type, description, is_public, is_editable) VALUES 
('site.title', '我的博客', 'STRING', '网站标题', TRUE, TRUE),
('site.description', '分享技术，记录生活', 'STRING', '网站描述', TRUE, TRUE),
('site.keywords', '博客,技术,生活,分享', 'STRING', '网站关键词', TRUE, TRUE),
('site.author', '博主', 'STRING', '网站作者', TRUE, TRUE),
('site.email', 'admin@example.com', 'STRING', '联系邮箱', TRUE, TRUE),
('site.url', 'http://localhost:3000', 'STRING', '网站URL', TRUE, TRUE),
('site.logo', '', 'STRING', '网站Logo', TRUE, TRUE),
('site.favicon', '', 'STRING', '网站图标', TRUE, TRUE),
('site.icp', '', 'STRING', 'ICP备案号', TRUE, TRUE),
('site.analytics', '', 'STRING', '统计代码', FALSE, TRUE),
('comment.enable', 'true', 'BOOLEAN', '启用评论', TRUE, TRUE),
('comment.audit', 'true', 'BOOLEAN', '评论审核', TRUE, TRUE),
('comment.guest', 'true', 'BOOLEAN', '允许游客评论', TRUE, TRUE),
('upload.max_size', '10485760', 'INTEGER', '上传文件最大大小(字节)', FALSE, TRUE),
('upload.allowed_types', 'jpg,jpeg,png,gif,webp,pdf,doc,docx,txt', 'STRING', '允许上传的文件类型', FALSE, TRUE),
('mail.enable', 'false', 'BOOLEAN', '启用邮件通知', FALSE, TRUE),
('mail.smtp_host', '', 'STRING', 'SMTP服务器', FALSE, TRUE),
('mail.smtp_port', '587', 'INTEGER', 'SMTP端口', FALSE, TRUE),
('mail.smtp_user', '', 'STRING', 'SMTP用户名', FALSE, TRUE),
('mail.smtp_pass', '', 'STRING', 'SMTP密码', FALSE, FALSE),
('cache.enable', 'true', 'BOOLEAN', '启用缓存', FALSE, TRUE),
('cache.ttl', '3600', 'INTEGER', '缓存过期时间(秒)', FALSE, TRUE);

-- 插入默认导航菜单
INSERT INTO navigation_menus (name, location, description) VALUES 
('主导航', 'header', '网站头部主导航菜单'),
('底部导航', 'footer', '网站底部导航菜单');

-- 插入默认导航菜单项
INSERT INTO navigation_menu_items (menu_id, title, url, sort_order, object_type) VALUES 
((SELECT id FROM navigation_menus WHERE location = 'header'), '首页', '/', 1, 'CUSTOM'),
((SELECT id FROM navigation_menus WHERE location = 'header'), '文章', '/posts', 2, 'CUSTOM'),
((SELECT id FROM navigation_menus WHERE location = 'header'), '分类', '/categories', 3, 'CUSTOM'),
((SELECT id FROM navigation_menus WHERE location = 'header'), '标签', '/tags', 4, 'CUSTOM'),
((SELECT id FROM navigation_menus WHERE location = 'header'), '关于', '/about', 5, 'CUSTOM');

-- 插入默认页面
INSERT INTO pages (title, slug, content, status, author_id, published_at) VALUES 
('关于我', 'about', '这里是关于页面的内容...', 'PUBLISHED', (SELECT id FROM users WHERE username = 'admin'), NOW()),
('隐私政策', 'privacy', '这里是隐私政策的内容...', 'PUBLISHED', (SELECT id FROM users WHERE username = 'admin'), NOW()),
('使用条款', 'terms', '这里是使用条款的内容...', 'PUBLISHED', (SELECT id FROM users WHERE username = 'admin'), NOW());

-- DOWN
DROP TABLE IF EXISTS navigation_menu_items;
DROP TABLE IF EXISTS navigation_menus;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS friend_links;
DROP TABLE IF EXISTS media_files;
DROP TABLE IF EXISTS system_config;