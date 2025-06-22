package com.blog.dto;

import lombok.Data;

import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * 系统设置数据传输对象
 */
@Data
public class SettingDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 设置ID（更新时使用）
     */
    private Long id;

    /**
     * 网站名称
     */
    @Size(max = 100, message = "网站名称长度不能超过100个字符")
    private String siteName;

    /**
     * 网站描述
     */
    @Size(max = 255, message = "网站描述长度不能超过255个字符")
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
    @Size(max = 500, message = "网站关键词长度不能超过500个字符")
    private String siteKeywords;

    /**
     * 网站备案号
     */
    @Size(max = 100, message = "网站备案号长度不能超过100个字符")
    private String siteIcp;

    /**
     * 联系邮箱
     */
    @Size(max = 100, message = "联系邮箱长度不能超过100个字符")
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
}