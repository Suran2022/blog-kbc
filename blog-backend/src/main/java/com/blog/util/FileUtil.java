package com.blog.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * 文件上传工具类
 */
@Component
public class FileUtil {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.allowed-types}")
    private String allowedTypes;

    @Value("${file.max-size}")
    private String maxSizeStr;

    /**
     * 上传文件
     *
     * @param file 文件
     * @return 文件访问路径
     * @throws IOException IO异常
     */
    public String uploadFile(MultipartFile file) throws IOException {
        // 检查文件是否为空
        if (file.isEmpty()) {
            throw new IOException("文件为空");
        }

        // 检查文件类型
        String contentType = file.getContentType();
        List<String> allowedTypeList = Arrays.asList(allowedTypes.split(","));
        if (contentType == null || !allowedTypeList.contains(contentType)) {
            throw new IOException("不支持的文件类型");
        }

        // 检查文件大小
        long maxSize = parseSize(maxSizeStr);
        if (file.getSize() > maxSize) {
            throw new IOException("文件大小超过限制");
        }

        // 创建上传目录
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 生成文件名
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + extension;

        // 保存文件
        Path targetLocation = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), targetLocation);

        // 返回文件访问路径
        return "/uploads/" + filename;
    }

    /**
     * 解析文件大小字符串
     *
     * @param sizeStr 大小字符串，如：10MB
     * @return 字节数
     */
    private long parseSize(String sizeStr) {
        sizeStr = sizeStr.toUpperCase();
        long size;
        if (sizeStr.endsWith("KB")) {
            size = Long.parseLong(sizeStr.substring(0, sizeStr.length() - 2)) * 1024;
        } else if (sizeStr.endsWith("MB")) {
            size = Long.parseLong(sizeStr.substring(0, sizeStr.length() - 2)) * 1024 * 1024;
        } else if (sizeStr.endsWith("GB")) {
            size = Long.parseLong(sizeStr.substring(0, sizeStr.length() - 2)) * 1024 * 1024 * 1024;
        } else {
            size = Long.parseLong(sizeStr);
        }
        return size;
    }

    /**
     * 删除文件
     *
     * @param filePath 文件路径
     * @return 是否删除成功
     */
    public boolean deleteFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return false;
        }

        // 从路径中提取文件名
        String filename = filePath;
        if (filePath.startsWith("/uploads/")) {
            filename = filePath.substring("/uploads/".length());
        }

        // 删除文件
        Path targetLocation = Paths.get(uploadDir).resolve(filename).toAbsolutePath().normalize();
        try {
            return Files.deleteIfExists(targetLocation);
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * 上传文件到指定目录
     *
     * @param file      文件
     * @param directory 目录
     * @return 文件访问路径
     * @throws IOException IO异常
     */
    public String uploadFile(MultipartFile file, String directory) throws IOException {
        // 检查文件是否为空
        if (file.isEmpty()) {
            throw new IOException("文件为空");
        }

        // 检查文件类型
        String contentType = file.getContentType();
        List<String> allowedTypeList = Arrays.asList(allowedTypes.split(","));
        if (contentType == null || !allowedTypeList.contains(contentType)) {
            throw new IOException("不支持的文件类型");
        }

        // 检查文件大小
        long maxSize = parseSize(maxSizeStr);
        if (file.getSize() > maxSize) {
            throw new IOException("文件大小超过限制");
        }

        // 创建上传目录
        Path uploadPath = Paths.get(uploadDir, directory).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 生成文件名
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + extension;

        // 保存文件
        Path targetLocation = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), targetLocation);

        // 返回文件访问路径
        return "/uploads/" + directory + "/" + filename;
    }
}