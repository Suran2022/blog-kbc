package com.blog.dto;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

/**
 * 用户数据传输对象
 */
@Data
@Builder
public class UserDTO implements Serializable {

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
}