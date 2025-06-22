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
     * 底部信息
     */
    private String footerInfo;
}