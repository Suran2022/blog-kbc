package com.blog.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * 分类数据传输对象
 */
@Data
public class CategoryDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 分类ID（更新时使用）
     */
    private Long id;

    /**
     * 分类名称
     */
    @NotBlank(message = "分类名称不能为空")
    @Size(max = 50, message = "分类名称长度不能超过50个字符")
    private String name;

    /**
     * 描述
     */
    @Size(max = 255, message = "描述长度不能超过255个字符")
    private String description;

    /**
     * 排序
     */
    private Integer sort = 0;

    /**
     * 状态：0-禁用，1-正常
     */
    private Integer status = 1;
}