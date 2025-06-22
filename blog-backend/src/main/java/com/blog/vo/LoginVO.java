package com.blog.vo;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

/**
 * 登录响应视图对象
 */
@Data
@Builder
public class LoginVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    private Long id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 认证令牌
     */
    private String token;
}