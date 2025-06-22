package com.blog.vo;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 贡献者视图对象
 */
@Data
@Builder
public class ContributorVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 贡献者ID
     */
    private Long id;

    /**
     * 姓名
     */
    private String name;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 简介
     */
    private String introduction;

    /**
     * 排序
     */
    private Integer sort;

    /**
     * 状态：0-禁用，1-正常
     */
    private Integer status;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}