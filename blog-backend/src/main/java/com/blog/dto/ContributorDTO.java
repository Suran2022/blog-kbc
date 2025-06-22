package com.blog.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * 贡献者数据传输对象
 */
@Data
public class ContributorDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 贡献者ID（更新时使用）
     */
    private Long id;

    /**
     * 姓名
     */
    @NotBlank(message = "姓名不能为空")
    @Size(max = 50, message = "姓名长度不能超过50个字符")
    private String name;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 简介
     */
    @Size(max = 255, message = "简介长度不能超过255个字符")
    private String introduction;

    /**
     * 排序
     */
    private Integer sort = 0;

    /**
     * 状态：0-禁用，1-正常
     */
    private Integer status = 1;
}