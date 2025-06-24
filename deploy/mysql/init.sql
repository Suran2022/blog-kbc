-- 博客系统数据库初始化脚本

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(50),
  `avatar` varchar(255),
  `bio` text,
  `role` enum('ADMIN','USER') DEFAULT 'USER',
  `status` enum('ACTIVE','INACTIVE','BANNED') DEFAULT 'ACTIVE',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 分类表
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `color` varchar(7) DEFAULT '#007bff',
  `sort_order` int DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文章表
CREATE TABLE IF NOT EXISTS `articles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `content` longtext NOT NULL,
  `summary` text,
  `cover_image` varchar(255),
  `author_id` bigint NOT NULL,
  `category_id` bigint,
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') DEFAULT 'DRAFT',
  `view_count` int DEFAULT 0,
  `like_count` int DEFAULT 0,
  `comment_count` int DEFAULT 0,
  `is_top` tinyint(1) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 0,
  `published_at` timestamp NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_author_id` (`author_id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_published_at` (`published_at`),
  KEY `idx_is_top` (`is_top`),
  KEY `idx_is_featured` (`is_featured`),
  FULLTEXT KEY `ft_title_content` (`title`,`content`),
  CONSTRAINT `fk_articles_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_articles_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 标签表
CREATE TABLE IF NOT EXISTS `tags` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `color` varchar(7) DEFAULT '#6c757d',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS `article_tags` (
  `article_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  PRIMARY KEY (`article_id`,`tag_id`),
  KEY `idx_tag_id` (`tag_id`),
  CONSTRAINT `fk_article_tags_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_article_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 评论表
CREATE TABLE IF NOT EXISTS `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `article_id` bigint NOT NULL,
  `user_id` bigint,
  `parent_id` bigint,
  `content` text NOT NULL,
  `author_name` varchar(50),
  `author_email` varchar(100),
  `author_website` varchar(255),
  `ip_address` varchar(45),
  `user_agent` varchar(500),
  `status` enum('PENDING','APPROVED','REJECTED','SPAM') DEFAULT 'PENDING',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_article_id` (`article_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_comments_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_comments_parent` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 系统设置表
CREATE TABLE IF NOT EXISTS `settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `site_name` varchar(100),
  `site_description` varchar(255),
  `site_logo` varchar(255),
  `site_favicon` varchar(255),
  `site_keywords` varchar(500),
  `site_icp` varchar(100),
  `site_email` varchar(100),
  `footer_info` text,
  `allow_comments` boolean NOT NULL DEFAULT true,
  `comment_audit` boolean NOT NULL DEFAULT true,
  `create_time` timestamp DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文件上传记录表
CREATE TABLE IF NOT EXISTS `file_uploads` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `original_name` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` bigint NOT NULL,
  `file_type` varchar(100),
  `upload_user_id` bigint,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_upload_user_id` (`upload_user_id`),
  KEY `idx_file_type` (`file_type`),
  CONSTRAINT `fk_file_uploads_user` FOREIGN KEY (`upload_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入初始数据

-- 插入管理员用户 (密码: admin123)
INSERT INTO `users` (`username`, `email`, `password`, `nickname`, `role`, `status`) VALUES
('admin', 'admin@blog.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyF5bB4M1A4g2mRCq7Tc2YNVTKG', '管理员', 'ADMIN', 'ACTIVE');

-- 插入默认分类
INSERT INTO `categories` (`name`, `description`, `color`, `sort_order`) VALUES
('技术分享', '分享技术相关的文章', '#007bff', 1),
('生活随笔', '记录生活中的点点滴滴', '#28a745', 2),
('学习笔记', '学习过程中的笔记和总结', '#ffc107', 3),
('项目经验', '项目开发中的经验分享', '#dc3545', 4);

-- 插入默认标签
INSERT INTO `tags` (`name`, `color`) VALUES
('Java', '#f89820'),
('Spring Boot', '#6db33f'),
('Vue.js', '#4fc08d'),
('MySQL', '#4479a1'),
('Redis', '#dc382d'),
('Docker', '#2496ed'),
('前端', '#61dafb'),
('后端', '#68217a'),
('全栈', '#ff6b6b');

-- 插入系统设置
INSERT INTO `settings` (`site_name`, `site_description`, `site_keywords`, `site_logo`, `site_favicon`, `site_icp`, `site_email`, `footer_info`, `allow_comments`, `comment_audit`) VALUES
('我的博客', '一个基于Vue+Spring Boot的博客系统', 'blog,博客,技术分享,Vue,Spring Boot', '/uploads/default-logo.png', '/uploads/default-favicon.ico', '', 'admin@example.com', '© 2023 博客系统 版权所有', true, true);

SET FOREIGN_KEY_CHECKS = 1;