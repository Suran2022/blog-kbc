package com.blog.common;

/**
 * API返回码常量
 */
public class ResultCode {

    /**
     * 成功
     */
    public static final Integer SUCCESS = 200;

    /**
     * 失败
     */
    public static final Integer FAILED = 500;

    /**
     * 参数校验失败
     */
    public static final Integer VALIDATE_FAILED = 400;

    /**
     * 未认证
     */
    public static final Integer UNAUTHORIZED = 401;

    /**
     * 未授权
     */
    public static final Integer FORBIDDEN = 403;

    /**
     * 资源不存在
     */
    public static final Integer NOT_FOUND = 404;

    /**
     * 方法不允许
     */
    public static final Integer METHOD_NOT_ALLOWED = 405;

    /**
     * 请求超时
     */
    public static final Integer REQUEST_TIMEOUT = 408;

    /**
     * 服务不可用
     */
    public static final Integer SERVICE_UNAVAILABLE = 503;
}