-- 创建评论表
CREATE TABLE comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT NOT NULL COMMENT '文章ID',
    content TEXT NOT NULL COMMENT '评论内容',
    author VARCHAR(50) NOT NULL COMMENT '评论者姓名',
    email VARCHAR(100) NOT NULL COMMENT '评论者邮箱',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '评论状态：PENDING-待审核，APPROVED-已通过，REJECTED-已拒绝',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_article_id (article_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- 插入评论相关的系统设置（如果不存在）
INSERT IGNORE INTO setting (setting_key, setting_value, description) VALUES 
('allowComments', 'true', '是否允许评论'),
('commentAudit', 'true', '是否需要评论审核');

-- 添加一些示例评论数据（可选）
INSERT INTO comment (article_id, content, author, email, status, created_at) VALUES 
(1, '这篇文章写得很好，学到了很多！', '张三', 'zhangsan@example.com', 'APPROVED', NOW() - INTERVAL 2 DAY),
(1, '感谢分享，很有帮助。', '李四', 'lisi@example.com', 'APPROVED', NOW() - INTERVAL 1 DAY),
(1, '有个小问题想请教一下...', '王五', 'wangwu@example.com', 'PENDING', NOW() - INTERVAL 12 HOUR),
(2, '期待更多这样的内容！', '赵六', 'zhaoliu@example.com', 'APPROVED', NOW() - INTERVAL 3 HOUR);