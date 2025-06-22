package com.blog.exception;

/**
 * 自定义博客系统异常
 */
public class BlogException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * 错误码
     */
    private Integer code;

    /**
     * 构造方法
     *
     * @param message 错误信息
     */
    public BlogException(String message) {
        super(message);
        this.code = 500;
    }

    /**
     * 构造方法
     *
     * @param code    错误码
     * @param message 错误信息
     */
    public BlogException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    /**
     * 获取错误码
     *
     * @return 错误码
     */
    public Integer getCode() {
        return code;
    }
}