package com.blog.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * 系统设置实体类
 */
@Data
@Entity
@Table(name = "setting")
@EntityListeners(AuditingEntityListener.class)
public class Setting implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 网站名称
     */
    @Column(name = "site_name", length = 100)
    private String siteName;

    /**
     * 网站描述
     */
    @Column(name = "site_description", length = 255)
    private String siteDescription;

    /**
     * 网站Logo
     */
    @Column(name = "site_logo", length = 255)
    private String siteLogo;

    /**
     * 网站图标
     */
    @Column(name = "site_favicon", length = 255)
    private String siteFavicon;

    /**
     * 底部信息
     */
    @Column(name = "footer_info", columnDefinition = "text")
    private String footerInfo;

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