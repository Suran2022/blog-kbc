package com.blog.controller;

import com.blog.common.Result;
import com.blog.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件上传控制器
 */
@Tag(name = "文件上传管理", description = "文件上传相关接口")
@RestController
@RequestMapping("/files")
@SecurityRequirement(name = "Bearer Authentication")
public class FileController {

    @Autowired
    private FileService fileService;

    /**
     * 上传图片
     *
     * @param file 图片文件
     * @return 上传结果
     */
    @Operation(summary = "上传图片", description = "上传图片文件")
    @PostMapping("/images")
    @PreAuthorize("isAuthenticated()")
    public Result<String> uploadImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = fileService.uploadImage(file);
        return Result.success(imageUrl);
    }

    /**
     * 上传文件
     *
     * @param file 文件
     * @return 上传结果
     */
    @Operation(summary = "上传文件", description = "上传普通文件")
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Result<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileService.uploadFile(file);
        return Result.success(fileUrl);
    }
}