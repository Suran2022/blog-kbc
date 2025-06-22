package com.blog.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * 文件服务接口
 */
public interface FileService {

    /**
     * 上传图片
     *
     * @param file 图片文件
     * @return 图片URL
     */
    String uploadImage(MultipartFile file);

    /**
     * 上传文件
     *
     * @param file 文件
     * @return 文件URL
     */
    String uploadFile(MultipartFile file);
}