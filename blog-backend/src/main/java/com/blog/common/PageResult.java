package com.blog.common;

import lombok.Data;

import java.util.List;

/**
 * 分页结果封装
 */
@Data
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
     * 数据列表
     */
    private List<T> list;

    /**
     * 构造方法
     *
     * @param page  当前页码
     * @param size  每页数量
     * @param total 总记录数
     * @param list  数据列表
     */
    public PageResult(Integer page, Integer size, Long total, List<T> list) {
        this.page = page;
        this.size = size;
        this.total = total;
        this.list = list;
        this.pages = (int) Math.ceil((double) total / size);
    }
}