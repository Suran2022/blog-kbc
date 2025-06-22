package com.blog.service.impl;

import com.blog.exception.BlogException;
import com.blog.service.FileService;
import com.blog.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * 文件服务实现类
 */
@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private FileUtil fileUtil;

    /**
     * 允许的图片类型
     */
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/gif", "image/webp");

    /**
     * 允许的文件类型
     */
    private static final List<String> ALLOWED_FILE_TYPES = Arrays.asList(
            "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain", "application/zip", "application/x-rar-compressed");

    @Override
    public String uploadImage(MultipartFile file) {
        // 检查文件类型
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new BlogException("不支持的图片类型");
        }

        try {
            // 上传图片
            return fileUtil.uploadFile(file, "images");
        } catch (IOException e) {
            throw new BlogException("图片上传失败: " + e.getMessage());
        }
    }

    @Override
    public String uploadFile(MultipartFile file) {
        // 检查文件类型
        String contentType = file.getContentType();
        if (contentType == null || (!ALLOWED_IMAGE_TYPES.contains(contentType) && !ALLOWED_FILE_TYPES.contains(contentType))) {
            throw new BlogException("不支持的文件类型");
        }

        try {
            // 上传文件
            return fileUtil.uploadFile(file, "files");
        } catch (IOException e) {
            throw new BlogException("文件上传失败: " + e.getMessage());
        }
    }
}