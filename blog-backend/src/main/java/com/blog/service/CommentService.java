package com.blog.service;

import com.blog.dto.CommentDTO;
import com.blog.entity.Comment;
import com.blog.repository.CommentRepository;
import com.blog.repository.SettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 评论服务类
 */
@Service
@Transactional
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private SettingRepository settingRepository;
    
    /**
     * 创建评论
     * @param commentDTO 评论数据
     * @return 创建的评论
     */
    public CommentDTO createComment(CommentDTO commentDTO) {
        System.out.println("[DEBUG] 开始创建评论: " + commentDTO.toString());
        
        try {
            // 检查是否允许评论
            System.out.println("[DEBUG] 检查评论是否允许");
            boolean allowComments = isCommentsAllowed();
            System.out.println("[DEBUG] 评论允许状态: " + allowComments);
            if (!allowComments) {
                throw new RuntimeException("评论功能已关闭");
            }
            
            System.out.println("[DEBUG] 转换DTO为实体");
            Comment comment = commentDTO.toEntity();
            System.out.println("[DEBUG] 转换后的实体: " + comment.toString());
            
            // 根据系统设置决定评论状态
            System.out.println("[DEBUG] 检查是否需要审核");
            boolean needAudit = isCommentAuditEnabled();
            System.out.println("[DEBUG] 需要审核: " + needAudit);
            if (needAudit) {
                comment.setStatus(Comment.CommentStatus.PENDING);
            } else {
                comment.setStatus(Comment.CommentStatus.APPROVED);
            }
            
            System.out.println("[DEBUG] 保存评论到数据库");
            Comment savedComment = commentRepository.save(comment);
            System.out.println("[DEBUG] 保存成功，返回结果");
            return new CommentDTO(savedComment);
        } catch (Exception e) {
            System.err.println("[ERROR] 创建评论时发生异常: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * 根据文章ID获取已审核通过的评论
     * @param articleId 文章ID
     * @param page 页码
     * @param size 每页大小
     * @return 评论分页数据
     */
    @Transactional(readOnly = true)
    public Page<CommentDTO> getApprovedCommentsByArticleId(Long articleId, int page, int size) {
        System.out.println("[DEBUG] 获取文章ID为" + articleId + "的已审核评论，页码：" + page + "，每页大小：" + size);
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Comment> comments = commentRepository.findByArticleIdAndStatusOrderByCreatedAtDesc(
                    articleId, Comment.CommentStatus.APPROVED, pageable);
            
            System.out.println("[DEBUG] 从数据库获取到评论数量：" + comments.getContent().size() + "，总评论数：" + comments.getTotalElements());
            
            // 检查评论内容
            for (Comment comment : comments.getContent()) {
                System.out.println("[DEBUG] 评论ID: " + comment.getId() + ", 作者: " + comment.getAuthor() + ", 内容: " + comment.getContent());
            }
            
            Page<CommentDTO> commentDTOs = comments.map(comment -> {
                CommentDTO dto = new CommentDTO(comment);
                System.out.println("[DEBUG] 转换后的DTO - 评论ID: " + dto.getId() + ", 作者: " + dto.getAuthor() + ", 内容: " + dto.getContent());
                return dto;
            });
            
            return commentDTOs;
        } catch (Exception e) {
            System.err.println("[ERROR] 获取评论时发生异常: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * 获取所有评论（管理员用）
     * @param status 评论状态（可选）
     * @param page 页码
     * @param size 每页大小
     * @return 评论分页数据
     */
    @Transactional(readOnly = true)
    public Page<CommentDTO> getAllComments(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> comments;
        
        if (status != null && !status.isEmpty()) {
            Comment.CommentStatus commentStatus = Comment.CommentStatus.valueOf(status.toUpperCase());
            comments = commentRepository.findByStatusOrderByCreatedAtDesc(commentStatus, pageable);
        } else {
            comments = commentRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
        
        return comments.map(CommentDTO::new);
    }
    
    /**
     * 审核评论（通过）
     * @param commentId 评论ID
     * @return 更新后的评论
     */
    public CommentDTO approveComment(Long commentId) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            comment.setStatus(Comment.CommentStatus.APPROVED);
            Comment savedComment = commentRepository.save(comment);
            return new CommentDTO(savedComment);
        }
        throw new RuntimeException("评论不存在");
    }
    
    /**
     * 审核评论（拒绝）
     * @param commentId 评论ID
     * @return 更新后的评论
     */
    public CommentDTO rejectComment(Long commentId) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            comment.setStatus(Comment.CommentStatus.REJECTED);
            Comment savedComment = commentRepository.save(comment);
            return new CommentDTO(savedComment);
        }
        throw new RuntimeException("评论不存在");
    }
    
    /**
     * 删除评论
     * @param commentId 评论ID
     */
    public void deleteComment(Long commentId) {
        if (commentRepository.existsById(commentId)) {
            commentRepository.deleteById(commentId);
        } else {
            throw new RuntimeException("评论不存在");
        }
    }
    
    /**
     * 根据ID获取评论
     * @param commentId 评论ID
     * @return 评论数据
     */
    @Transactional(readOnly = true)
    public CommentDTO getCommentById(Long commentId) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if (optionalComment.isPresent()) {
            return new CommentDTO(optionalComment.get());
        }
        throw new RuntimeException("评论不存在");
    }
    
    /**
     * 统计待审核评论数量
     * @return 待审核评论数量
     */
    @Transactional(readOnly = true)
    public long countPendingComments() {
        return commentRepository.countPendingComments();
    }
    
    /**
     * 统计总评论数量
     * @return 总评论数量
     */
    @Transactional(readOnly = true)
    public long countTotalComments() {
        return commentRepository.countTotalComments();
    }
    
    /**
     * 检查是否允许评论
     * @return 是否允许评论
     */
    private boolean isCommentsAllowed() {
        return settingRepository.findFirstByOrderById()
                .map(setting -> setting.getAllowComments())
                .orElse(true); // 默认允许评论
    }
    
    /**
     * 检查是否需要评论审核
     * @return 是否需要审核
     */
    private boolean isCommentAuditEnabled() {
        return settingRepository.findFirstByOrderById()
                .map(setting -> setting.getCommentAudit())
                .orElse(true); // 默认需要审核
    }
}