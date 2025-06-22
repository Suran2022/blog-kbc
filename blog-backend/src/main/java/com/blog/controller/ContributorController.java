package com.blog.controller;

import com.blog.common.Result;
import com.blog.dto.ContributorDTO;
import com.blog.service.ContributorService;
import com.blog.vo.ContributorVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 贡献者控制器
 */
@Tag(name = "贡献者管理", description = "贡献者相关接口")
@RestController
@RequestMapping("/contributors")
public class ContributorController {

    @Autowired
    private ContributorService contributorService;

    /**
     * 创建贡献者
     *
     * @param contributorDTO 贡献者信息
     * @return 创建结果
     */
    @Operation(summary = "创建贡献者", description = "创建新贡献者")
    @PostMapping
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("isAuthenticated()")
    public Result<ContributorVO> createContributor(@Validated @RequestBody ContributorDTO contributorDTO) {
        ContributorVO contributorVO = contributorService.createContributor(contributorDTO);
        return Result.success(contributorVO);
    }

    /**
     * 更新贡献者
     *
     * @param id             贡献者ID
     * @param contributorDTO 贡献者信息
     * @return 更新结果
     */
    @Operation(summary = "更新贡献者", description = "根据ID更新贡献者信息")
    @PutMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("isAuthenticated()")
    public Result<ContributorVO> updateContributor(@PathVariable Long id, @Validated @RequestBody ContributorDTO contributorDTO) {
        ContributorVO contributorVO = contributorService.updateContributor(id, contributorDTO);
        return Result.success(contributorVO);
    }

    /**
     * 删除贡献者
     *
     * @param id 贡献者ID
     * @return 删除结果
     */
    @Operation(summary = "删除贡献者", description = "根据ID删除贡献者")
    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("isAuthenticated()")
    public Result<Void> deleteContributor(@PathVariable Long id) {
        contributorService.deleteContributor(id);
        return Result.success();
    }

    /**
     * 获取贡献者详情
     *
     * @param id 贡献者ID
     * @return 贡献者详情
     */
    @Operation(summary = "获取贡献者详情", description = "根据ID获取贡献者详细信息")
    @GetMapping("/{id}")
    public Result<ContributorVO> getContributor(@PathVariable Long id) {
        ContributorVO contributorVO = contributorService.getContributor(id);
        return Result.success(contributorVO);
    }

    /**
     * 获取所有贡献者
     *
     * @return 贡献者列表
     */
    @Operation(summary = "获取所有贡献者", description = "获取所有可用的贡献者列表")
    @GetMapping
    public Result<List<ContributorVO>> getAllContributors() {
        List<ContributorVO> contributorVOList = contributorService.getAllContributors();
        return Result.success(contributorVOList);
    }
}