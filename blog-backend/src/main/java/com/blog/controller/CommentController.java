package com.blog.controller;

import com.blog.dto.CommentDTO;
import com.blog.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * 评论控制器
 */
@RestController
@RequestMapping("/api/comments")
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    /**
     * 创建评论
     * @param commentDTO 评论数据
     * @return 创建结果
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createComment(@Valid @RequestBody CommentDTO commentDTO) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("收到评论请求: " + commentDTO.toString());
            CommentDTO createdComment = commentService.createComment(commentDTO);
            System.out.println("评论创建成功: " + createdComment.getId() + ", 状态: " + createdComment.getStatus());
            
            response.put("success", true);
            response.put("message", "评论提交成功");
            response.put("data", createdComment);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("创建评论时发生错误: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 根据文章ID获取已审核通过的评论
     * @param articleId 文章ID
     * @param page 页码（默认0）
     * @param size 每页大小（默认10）
     * @return 评论分页数据
     */
    @GetMapping("/article/{articleId}")
    public ResponseEntity<Map<String, Object>> getCommentsByArticleId(
            @PathVariable Long articleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("获取文章ID为" + articleId + "的评论，页码：" + page + "，每页大小：" + size);
            Page<CommentDTO> comments = commentService.getApprovedCommentsByArticleId(articleId, page, size);
            System.out.println("获取到评论数量：" + comments.getContent().size() + "，总评论数：" + comments.getTotalElements());
            
            // 检查评论内容是否正确
            for (CommentDTO comment : comments.getContent()) {
                System.out.println("评论ID: " + comment.getId() + ", 作者: " + comment.getAuthor() + ", 内容: " + comment.getContent());
            }
            
            response.put("success", true);
            response.put("data", comments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("获取评论失败: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 获取所有评论（管理员用）
     * @param status 评论状态（可选）
     * @param page 页码（默认0）
     * @param size 每页大小（默认10）
     * @return 评论分页数据
     */
    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> getAllComments(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            Page<CommentDTO> comments = commentService.getAllComments(status, page, size);
            response.put("success", true);
            response.put("data", comments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 审核评论（通过）
     * @param commentId 评论ID
     * @return 审核结果
     */
    @PutMapping("/{commentId}/approve")
    public ResponseEntity<Map<String, Object>> approveComment(@PathVariable Long commentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            CommentDTO updatedComment = commentService.approveComment(commentId);
            response.put("success", true);
            response.put("message", "评论审核通过");
            response.put("data", updatedComment);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 审核评论（拒绝）
     * @param commentId 评论ID
     * @return 审核结果
     */
    @PutMapping("/{commentId}/reject")
    public ResponseEntity<Map<String, Object>> rejectComment(@PathVariable Long commentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            CommentDTO updatedComment = commentService.rejectComment(commentId);
            response.put("success", true);
            response.put("message", "评论已拒绝");
            response.put("data", updatedComment);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 删除评论
     * @param commentId 评论ID
     * @return 删除结果
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Map<String, Object>> deleteComment(@PathVariable Long commentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            commentService.deleteComment(commentId);
            response.put("success", true);
            response.put("message", "评论删除成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 根据ID获取评论详情
     * @param commentId 评论ID
     * @return 评论详情
     */
    @GetMapping("/{commentId}")
    public ResponseEntity<Map<String, Object>> getCommentById(@PathVariable Long commentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            CommentDTO comment = commentService.getCommentById(commentId);
            response.put("success", true);
            response.put("data", comment);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 获取评论统计信息
     * @return 统计信息
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCommentStats() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("pendingCount", commentService.countPendingComments());
            stats.put("totalCount", commentService.countTotalComments());
            
            response.put("success", true);
            response.put("data", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}