package com.blog.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * 文章实体类
 */
@Data
@Entity
@Table(name = "article")
@EntityListeners(AuditingEntityListener.class)
public class Article implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 标题
     */
    @Column(name = "title", nullable = false, length = 100)
    private String title;

    /**
     * 内容
     */
    @Column(name = "content", nullable = false, columnDefinition = "longtext")
    private String content;

    /**
     * 摘要
     */
    @Column(name = "summary", length = 255)
    private String summary;

    /**
     * 缩略图
     */
    @Column(name = "thumbnail", length = 255)
    private String thumbnail;

    /**
     * 分类ID
     */
    @Column(name = "category_id")
    private Long categoryId;

    /**
     * 分类（非数据库字段）
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private Category category;

    /**
     * 浏览量
     */
    @Column(name = "view_count", columnDefinition = "int default 0")
    private Integer viewCount;

    /**
     * 状态：0-草稿，1-已发布
     */
    @Column(name = "status", columnDefinition = "tinyint default 1")
    private Integer status;

    /**
     * 创建时间
     */
    @CreatedDate
    @Column(name = "create_time", nullable = false)
    private Date createTime;

    /**
     * 更新时间
     */
    @LastModifiedDate
    @Column(name = "update_time", nullable = false)
    private Date updateTime;
}