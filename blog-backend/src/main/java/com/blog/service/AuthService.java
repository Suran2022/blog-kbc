package com.blog.service;

import com.blog.dto.LoginDTO;
import com.blog.vo.LoginVO;

/**
 * 认证服务接口
 */
public interface AuthService {

    /**
     * 用户登录
     *
     * @param loginDTO 登录参数
     * @return 登录结果
     */
    LoginVO login(LoginDTO loginDTO);

    /**
     * 获取当前用户信息
     *
     * @return 当前用户信息
     */
    LoginVO getCurrentUser();

    /**
     * 用户登出
     */
    void logout();
}