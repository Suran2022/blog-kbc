package com.blog.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 分页结果封装
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> {

    /**
     * 当前页码
     */
    private Integer page;

    /**
     * 每页数量
     */
    private Integer size;

    /**
     * 总记录数
     */
    private Long total;

    /**
     * 总页数
     */
    private Integer pages;

    /**
     * 总页数（兼容字段）
     */
    private Integer totalPages;

    /**
     * 数据列表
     */
    private List<T> list;

    /**
     * 内容列表（兼容字段）
     */
    private List<T> content;

    /**
     * 便捷构造方法
     *
     * @param page  当前页码
     * @param size  每页数量
     * @param total 总记录数
     * @param list  数据列表
     */
    public static <T> PageResult<T> of(Integer page, Integer size, Long total, List<T> list) {
        int totalPages = (int) Math.ceil((double) total / size);
        return PageResult.<T>builder()
                .page(page)
                .size(size)
                .total(total)
                .pages(totalPages)
                .totalPages(totalPages)
                .list(list)
                .content(list)
                .build();
    }
}