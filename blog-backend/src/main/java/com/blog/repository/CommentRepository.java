package com.blog.repository;

import com.blog.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 评论Repository接口
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    /**
     * 根据文章ID查询已审核通过的评论
     * @param articleId 文章ID
     * @param pageable 分页参数
     * @return 评论分页数据
     */
    Page<Comment> findByArticleIdAndStatusOrderByCreatedAtDesc(
            Long articleId, 
            Comment.CommentStatus status, 
            Pageable pageable
    );
    
    /**
     * 根据文章ID统计已审核通过的评论数量
     * @param articleId 文章ID
     * @param status 评论状态
     * @return 评论数量
     */
    long countByArticleIdAndStatus(Long articleId, Comment.CommentStatus status);
    
    /**
     * 根据状态查询评论（管理员用）
     * @param status 评论状态
     * @param pageable 分页参数
     * @return 评论分页数据
     */
    Page<Comment> findByStatusOrderByCreatedAtDesc(Comment.CommentStatus status, Pageable pageable);
    
    /**
     * 查询所有评论（管理员用）
     * @param pageable 分页参数
     * @return 评论分页数据
     */
    Page<Comment> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    /**
     * 根据文章ID查询所有评论
     * @param articleId 文章ID
     * @return 评论列表
     */
    List<Comment> findByArticleIdOrderByCreatedAtDesc(Long articleId);
    
    /**
     * 统计待审核评论数量
     * @return 待审核评论数量
     */
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.status = 'PENDING'")
    long countPendingComments();
    
    /**
     * 统计总评论数量
     * @return 总评论数量
     */
    @Query("SELECT COUNT(c) FROM Comment c")
    long countTotalComments();
    
    /**
     * 根据邮箱查询评论
     * @param email 邮箱
     * @param pageable 分页参数
     * @return 评论分页数据
     */
    @Query("SELECT c FROM Comment c WHERE c.email = :email ORDER BY c.createdAt DESC")
    Page<Comment> findByEmailOrderByCreatedAtDesc(@Param("email") String email, Pageable pageable);
}