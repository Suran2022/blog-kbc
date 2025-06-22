package com.blog.service.impl;

import com.blog.dto.LoginDTO;
import com.blog.entity.User;
import com.blog.exception.BlogException;
import com.blog.repository.UserRepository;
import com.blog.security.JwtUserDetails;
import com.blog.service.AuthService;
import com.blog.util.JwtUtil;
import com.blog.vo.LoginVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * 认证服务实现类
 */
@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    public LoginVO login(LoginDTO loginDTO) {
        // 认证用户
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));

        // 设置认证信息到上下文
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 获取用户详情
        JwtUserDetails userDetails = (JwtUserDetails) authentication.getPrincipal();

        // 生成JWT令牌
        String token = jwtUtil.generateToken(userDetails);

        // 查询用户信息
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BlogException("用户不存在"));

        // 构建登录响应
        return LoginVO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .avatar(user.getAvatar())
                .email(user.getEmail())
                .token(token)
                .build();
    }

    @Override
    public LoginVO getCurrentUser() {
        // 从安全上下文获取当前认证信息
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BlogException("用户未登录");
        }

        JwtUserDetails userDetails = (JwtUserDetails) authentication.getPrincipal();
        
        // 查询用户信息
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BlogException("用户不存在"));

        // 构建用户信息响应（不包含token）
        return LoginVO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .avatar(user.getAvatar())
                .email(user.getEmail())
                .build();
    }

    @Override
    public void logout() {
        // 清除安全上下文
        SecurityContextHolder.clearContext();
        // 注意：JWT是无状态的，实际的token失效需要在前端处理
        // 如果需要服务端token黑名单功能，可以在这里添加相关逻辑
    }
}