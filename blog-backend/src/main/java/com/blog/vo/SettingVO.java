package com.blog.vo;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 系统设置视图对象
 */
@Data
@Builder
public class SettingVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 设置ID
     */
    private Long id;

    /**
     * 网站名称
     */
    private String siteName;

    /**
     * 网站描述
     */
    private String siteDescription;

    /**
     * 网站Logo
     */
    private String siteLogo;

    /**
     * 网站图标
     */
    private String siteFavicon;

    /**
     * 网站关键词
     */
    private String siteKeywords;

    /**
     * 网站备案号
     */
    private String siteIcp;

    /**
     * 联系邮箱
     */
    private String siteEmail;

    /**
     * 底部信息
     */
    private String footerInfo;

    /**
     * 是否允许评论
     */
    private Boolean allowComments;

    /**
     * 评论是否需要审核
     */
    private Boolean commentAudit;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}