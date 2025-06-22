package com.blog.controller;

import com.blog.common.Result;
import com.blog.dto.SettingDTO;
import com.blog.service.SettingService;
import com.blog.vo.SettingVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 系统设置控制器
 */
@Tag(name = "系统设置管理", description = "系统设置相关接口")
@RestController
@RequestMapping("/settings")
public class SettingController {

    @Autowired
    private SettingService settingService;

    /**
     * 获取系统设置
     *
     * @return 系统设置
     */
    @Operation(summary = "获取系统设置", description = "获取系统设置信息")
    @GetMapping
    public Result<SettingVO> getSetting() {
        SettingVO settingVO = settingService.getSetting();
        return Result.success(settingVO);
    }

    /**
     * 更新系统设置
     *
     * @param settingDTO 系统设置信息
     * @return 更新结果
     */
    @Operation(summary = "更新系统设置", description = "更新系统设置信息")
    @PutMapping
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("isAuthenticated()")
    public Result<SettingVO> updateSetting(@Validated @RequestBody SettingDTO settingDTO) {
        SettingVO settingVO = settingService.updateSetting(settingDTO);
        return Result.success(settingVO);
    }
}