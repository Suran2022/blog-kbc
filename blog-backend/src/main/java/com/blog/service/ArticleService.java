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

    /**
     * 搜索文章
     *
     * @param keyword 搜索关键词
     * @param tag     标签
     * @param page    页码
     * @param size    每页数量
     * @param sortBy  排序字段
     * @param sortDir 排序方向
     * @return 搜索结果
     */
    PageResult<ArticleVO> searchArticles(String keyword, String tag, Integer page, Integer size, String sortBy, String sortDir);

    /**
     * 获取搜索建议
     *
     * @param keyword 关键词前缀
     * @param limit   建议数量
     * @return 搜索建议列表
     */
    List<String> getSearchSuggestions(String keyword, Integer limit);

    /**
     * 获取热门搜索关键词
     *
     * @param limit 数量限制
     * @return 热门搜索关键词列表
     */
    List<String> getHotSearchKeywords(Integer limit);
}