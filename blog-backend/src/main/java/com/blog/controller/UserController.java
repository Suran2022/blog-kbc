package com.blog.controller;

import com.blog.common.Result;
import com.blog.dto.UserDTO;
import com.blog.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 */
@Tag(name = "用户管理", description = "用户相关接口")
@RestController
@RequestMapping("/users")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 获取当前用户信息
     *
     * @return 用户信息
     */
    @Operation(summary = "获取当前用户信息", description = "获取当前登录用户的详细信息")
    @GetMapping("/me")
    public Result<UserDTO> getCurrentUser() {
        UserDTO userDTO = userService.getCurrentUser();
        return Result.success(userDTO);
    }

    /**
     * 更新当前用户信息
     *
     * @param userDTO 用户信息
     * @return 更新结果
     */
    @Operation(summary = "更新当前用户信息", description = "更新当前登录用户的详细信息")
    @PutMapping("/me")
    public Result<UserDTO> updateCurrentUser(@Validated @RequestBody UserDTO userDTO) {
        UserDTO updatedUserDTO = userService.updateCurrentUser(userDTO);
        return Result.success(updatedUserDTO);
    }

    /**
     * 修改密码
     *
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 修改结果
     */
    @Operation(summary = "修改密码", description = "修改当前登录用户的密码")
    @PutMapping("/password")
    public Result<Void> changePassword(@RequestParam String oldPassword, @RequestParam String newPassword) {
        userService.changePassword(oldPassword, newPassword);
        return Result.success();
    }
}