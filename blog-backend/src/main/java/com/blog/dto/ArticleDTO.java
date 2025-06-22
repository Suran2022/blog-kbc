package com.blog.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * 文章数据传输对象
 */
@Data
public class ArticleDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 文章ID（更新时使用）
     */
    private Long id;

    /**
     * 标题
     */
    @NotBlank(message = "标题不能为空")
    @Size(max = 100, message = "标题长度不能超过100个字符")
    private String title;

    /**
     * 内容
     */
    @NotBlank(message = "内容不能为空")
    private String content;

    /**
     * 摘要
     */
    @Size(max = 255, message = "摘要长度不能超过255个字符")
    private String summary;

    /**
     * 缩略图
     */
    private String thumbnail;

    /**
     * 分类ID
     */
    private Long categoryId;

    /**
     * 状态：0-草稿，1-已发布
     */
    private Integer status = 1;
}