package com.blog.service.impl;

import com.blog.dto.UserDTO;
import com.blog.entity.User;
import com.blog.exception.BlogException;
import com.blog.repository.UserRepository;
import com.blog.security.JwtUserDetails;
import com.blog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDTO getCurrentUser() {
        User user = getCurrentUserEntity();
        return convertToDTO(user);
    }

    @Override
    @Transactional
    public UserDTO updateCurrentUser(UserDTO userDTO) {
        User user = getCurrentUserEntity();

        // 更新用户信息
        if (userDTO.getNickname() != null) {
            user.setNickname(userDTO.getNickname());
        }
        if (userDTO.getAvatar() != null) {
            user.setAvatar(userDTO.getAvatar());
        }
        if (userDTO.getEmail() != null) {
            // 检查邮箱是否已存在
            if (userRepository.existsByEmailAndIdNot(userDTO.getEmail(), user.getId())) {
                throw new BlogException("邮箱已被使用");
            }
            user.setEmail(userDTO.getEmail());
        }

        // 保存更新
        userRepository.save(user);

        return convertToDTO(user);
    }

    @Override
    @Transactional
    public void changePassword(String oldPassword, String newPassword) {
        User user = getCurrentUserEntity();

        // 验证旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BlogException("旧密码不正确");
        }

        // 更新密码
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * 获取当前登录用户实体
     *
     * @return 用户实体
     */
    private User getCurrentUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BlogException("用户未登录");
        }

        JwtUserDetails userDetails = (JwtUserDetails) authentication.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BlogException("用户不存在"));
    }

    /**
     * 将用户实体转换为DTO
     *
     * @param user 用户实体
     * @return 用户DTO
     */
    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .avatar(user.getAvatar())
                .email(user.getEmail())
                .build();
    }
}