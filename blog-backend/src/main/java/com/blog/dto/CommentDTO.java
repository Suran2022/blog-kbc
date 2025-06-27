package com.blog.dto;

import com.blog.entity.Comment;
import com.fasterxml.jackson.annotation.JsonFormat;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * 评论数据传输对象
 */
public class CommentDTO {
    
    private Long id;
    
    @NotNull(message = "文章ID不能为空")
    private Long articleId;
    
    @NotBlank(message = "评论内容不能为空")
    @Size(max = 1000, message = "评论内容不能超过1000个字符")
    private String content;
    
    @NotBlank(message = "作者姓名不能为空")
    @Size(max = 50, message = "作者姓名不能超过50个字符")
    private String author;
    
    @Email(message = "邮箱格式不正确")
    @NotBlank(message = "邮箱不能为空")
    @Size(max = 100, message = "邮箱不能超过100个字符")
    private String email;
    
    private Comment.CommentStatus status;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // 构造函数
    public CommentDTO() {}
    
    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.articleId = comment.getArticleId();
        this.content = comment.getContent();
        this.author = comment.getAuthor();
        this.email = comment.getEmail();
        this.status = comment.getStatus();
        this.createdAt = comment.getCreatedAt();
        this.updatedAt = comment.getUpdatedAt();
    }
    
    // 转换为实体对象
    public Comment toEntity() {
        Comment comment = new Comment();
        comment.setId(this.id);
        comment.setArticleId(this.articleId);
        comment.setContent(this.content);
        comment.setAuthor(this.author);
        comment.setEmail(this.email);
        if (this.status != null) {
            comment.setStatus(this.status);
        }
        return comment;
    }
    
    // Getter和Setter方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getArticleId() {
        return articleId;
    }
    
    public void setArticleId(Long articleId) {
        this.articleId = articleId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getAuthor() {
        return author;
    }
    
    public void setAuthor(String author) {
        this.author = author;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Comment.CommentStatus getStatus() {
        return status;
    }
    
    public void setStatus(Comment.CommentStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @Override
    public String toString() {
        return "CommentDTO{" +
                "id=" + id +
                ", articleId=" + articleId +
                ", content='" + content + '\'' +
                ", author='" + author + '\'' +
                ", email='" + email + '\'' +
                ", status=" + status +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}