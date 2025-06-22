package com.blog.service;

import com.blog.common.PageResult;
import com.blog.dto.ArticleDTO;
import com.blog.vo.ArticleVO;

import java.util.List;

/**
 * 文章服务接口
 */
public interface ArticleService {

    /**
     * 创建文章
     *
     * @param articleDTO 文章信息
     * @return 创建的文章
     */
    ArticleVO createArticle(ArticleDTO articleDTO);

    /**
     * 更新文章
     *
     * @param id         文章ID
     * @param articleDTO 文章信息
     * @return 更新后的文章
     */
    ArticleVO updateArticle(Long id, ArticleDTO articleDTO);

    /**
     * 删除文章
     *
     * @param id 文章ID
     */
    void deleteArticle(Long id);

    /**
     * 获取文章详情
     *
     * @param id 文章ID
     * @return 文章详情
     */
    ArticleVO getArticle(Long id);

    /**
     * 分页获取文章列表
     *
     * @param page     页码
     * @param size     每页数量
     * @param keyword  关键字
     * @param category 分类ID
     * @param status   状态：0-草稿，1-已发布，不传则查询所有
     * @return 文章列表
     */
    PageResult<ArticleVO> getArticles(Integer page, Integer size, String keyword, Long category, Integer status);

    /**
     * 获取最新文章列表
     *
     * @param limit 数量限制
     * @return 最新文章列表
     */
    List<ArticleVO> getLatestArticles(Integer limit);

    /**
     * 获取热门文章列表
     *
     * @param limit 数量限制
     * @return 热门文章列表
     */
    List<ArticleVO> getPopularArticles(Integer limit);
}