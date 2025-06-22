package com.blog.service;

import com.blog.dto.UserDTO;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 获取当前用户信息
     *
     * @return 用户信息
     */
    UserDTO getCurrentUser();

    /**
     * 更新当前用户信息
     *
     * @param userDTO 用户信息
     * @return 更新后的用户信息
     */
    UserDTO updateCurrentUser(UserDTO userDTO);

    /**
     * 修改密码
     *
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     */
    void changePassword(String oldPassword, String newPassword);
}