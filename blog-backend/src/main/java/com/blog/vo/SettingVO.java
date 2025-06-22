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
     * 底部信息
     */
    private String footerInfo;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}