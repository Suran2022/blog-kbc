package com.blog.repository;

import com.blog.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 文章数据访问接口
 */
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    /**
     * 根据分类ID查询文章列表
     *
     * @param categoryId 分类ID
     * @param pageable   分页参数
     * @return 文章列表
     */
    Page<Article> findByCategoryId(Long categoryId, Pageable pageable);

    /**
     * 根据标题或内容模糊查询文章列表
     *
     * @param title    标题
     * @param content  内容
     * @param pageable 分页参数
     * @return 文章列表
     */
    Page<Article> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);

    /**
     * 根据分类ID和标题或内容模糊查询文章列表
     *
     * @param categoryId 分类ID
     * @param title      标题
     * @param content    内容
     * @param pageable   分页参数
     * @return 文章列表
     */
    Page<Article> findByCategoryIdAndTitleContainingOrContentContaining(Long categoryId, String title, String content, Pageable pageable);

    /**
     * 根据分类ID查询文章列表
     *
     * @param categoryId 分类ID
     * @param pageable   分页参数
     * @return 文章列表
     */
    Page<Article> findByCategoryIdAndStatus(Long categoryId, Integer status, Pageable pageable);

    /**
     * 根据状态查询文章列表
     *
     * @param status   状态
     * @param pageable 分页参数
     * @return 文章列表
     */
    Page<Article> findByStatus(Integer status, Pageable pageable);

    /**
     * 根据标题或内容模糊查询文章列表
     *
     * @param keyword  关键词
     * @param status   状态
     * @param pageable 分页参数
     * @return 文章列表
     */
    @Query("SELECT a FROM Article a WHERE (a.title LIKE %?1% OR a.content LIKE %?1%) AND a.status = ?2")
    Page<Article> findByTitleOrContentContainingAndStatus(String keyword, Integer status, Pageable pageable);
    
    /**
     * 根据分类ID、标题或内容模糊查询文章列表，并按状态筛选
     *
     * @param categoryId 分类ID
     * @param keyword    关键词
     * @param status     状态
     * @param pageable   分页参数
     * @return 文章列表
     */
    @Query("SELECT a FROM Article a WHERE a.categoryId = ?1 AND (a.title LIKE %?2% OR a.content LIKE %?2%) AND a.status = ?3")
    Page<Article> findByCategoryIdAndTitleOrContentContainingAndStatus(Long categoryId, String keyword, Integer status, Pageable pageable);

    /**
     * 增加文章浏览量
     *
     * @param id 文章ID
     * @return 影响行数
     */
    @Modifying
    @Transactional
    @Query("UPDATE Article a SET a.viewCount = a.viewCount + 1 WHERE a.id = ?1")
    int incrementViewCount(Long id);

    /**
     * 根据状态查询文章并按创建时间倒序排列
     *
     * @param status   状态
     * @param pageable 分页参数
     * @return 文章列表
     */
    Page<Article> findByStatusOrderByCreateTimeDesc(Integer status, Pageable pageable);

    /**
     * 获取热门文章列表
     *
     * @param status 状态
     * @param limit  数量限制
     * @return 文章列表
     */
    List<Article> findByStatusOrderByViewCountDesc(Integer status, Pageable pageable);

    /**
     * 统计分类下的文章数量
     *
     * @param categoryId 分类ID
     * @return 文章数量
     */
    Long countByCategoryId(Long categoryId);

    /**
     * 获取最新文章列表
     *
     * @param limit 数量限制
     * @return 文章列表
     */
    @Query(value = "SELECT a FROM Article a WHERE a.status = 1 ORDER BY a.createTime DESC LIMIT :limit", nativeQuery = true)
    List<Article> findLatestArticles(@Param("limit") Integer limit);

    /**
     * 获取热门文章列表
     *
     * @param limit 数量限制
     * @return 文章列表
     */
    @Query(value = "SELECT a FROM Article a WHERE a.status = 1 ORDER BY a.viewCount DESC LIMIT :limit", nativeQuery = true)
    List<Article> findPopularArticles(@Param("limit") Integer limit);

    /**
     * 根据标题、内容、摘要模糊查询文章列表
     *
     * @param title    标题关键词
     * @param content  内容关键词
     * @param summary  摘要关键词
     * @param status   状态
     * @param pageable 分页参数
     * @return 文章列表
     */
    Page<Article> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseOrSummaryContainingIgnoreCaseAndStatus(
            String title, String content, String summary, Integer status, Pageable pageable);

    /**
     * 根据标签查询文章列表
     *
     * @param tag      标签
     * @param status   状态
     * @param pageable 分页参数
     * @return 文章列表
     */
    Page<Article> findByTagsContainingIgnoreCaseAndStatus(String tag, Integer status, Pageable pageable);

    /**
     * 根据标题和标签查询文章列表
     *
     * @param title    标题关键词
     * @param tag      标签
     * @param status   状态
     * @param pageable 分页参数
     * @return 文章列表
     */
    Page<Article> findByTitleContainingIgnoreCaseAndTagsContainingIgnoreCaseAndStatus(
            String title, String tag, Integer status, Pageable pageable);

    /**
     * 根据标题查询文章列表（用于搜索建议）
     *
     * @param title    标题关键词
     * @param status   状态
     * @param pageable 分页参数
     * @return 文章列表
     */
    List<Article> findByTitleContainingIgnoreCaseAndStatusOrderByViewCountDesc(
            String title, Integer status, Pageable pageable);

    /**
     * 根据关键词查询标题建议
     *
     * @param keyword 关键词
     * @param limit   限制数量
     * @return 标题建议列表
     */
    @Query(value = "SELECT DISTINCT a.title FROM Article a WHERE a.title LIKE CONCAT('%', :keyword, '%') AND a.status = 1 ORDER BY a.viewCount DESC LIMIT :limit", nativeQuery = true)
    List<String> findTitleSuggestions(@Param("keyword") String keyword, @Param("limit") int limit);

    /**
     * 查询热门搜索关键词
     *
     * @param limit 限制数量
     * @return 热门关键词列表
     */
    @Query("SELECT a.tags FROM Article a WHERE a.status = 1 AND a.tags IS NOT NULL GROUP BY a.tags ORDER BY COUNT(a.tags) DESC")
    List<String> findHotSearchKeywords(@Param("limit") int limit);

    /**
     * 根据标题模糊查询并按创建时间倒序排列
     *
     * @param title    标题关键词
     * @param status   状态
     * @param pageable 分页参数
     * @return 文章列表
     */
    Page<Article> findByTitleContainingIgnoreCaseAndStatusOrderByCreateTimeDesc(
            String title, Integer status, Pageable pageable);

    /**
     * 查询前10篇热门文章
     *
     * @param status 状态
     * @return 文章列表
     */
    List<Article> findTop10ByStatusOrderByViewCountDesc(Integer status);
}