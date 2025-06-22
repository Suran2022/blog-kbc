package com.blog.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * 贡献者实体类
 */
@Data
@Entity
@Table(name = "contributor")
@EntityListeners(AuditingEntityListener.class)
public class Contributor implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 姓名
     */
    @Column(name = "name", nullable = false, length = 50)
    private String name;

    /**
     * 头像
     */
    @Column(name = "avatar", length = 255)
    private String avatar;

    /**
     * 简介
     */
    @Column(name = "introduction", length = 255)
    private String introduction;

    /**
     * 排序
     */
    @Column(name = "sort", columnDefinition = "int default 0")
    private Integer sort;

    /**
     * 状态：0-禁用，1-正常
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