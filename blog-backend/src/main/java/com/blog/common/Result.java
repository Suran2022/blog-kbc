package com.blog.common;

import lombok.Data;

import java.io.Serializable;

/**
 * 统一API响应结果封装
 */
@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 状态码
     */
    private Integer code;

    /**
     * 消息
     */
    private String message;

    /**
     * 数据
     */
    private T data;

    /**
     * 私有构造方法，禁止直接创建
     */
    private Result() {
    }

    /**
     * 成功返回结果
     *
     * @param data 数据
     * @param <T>  数据类型
     * @return 结果
     */
    public static <T> Result<T> success(T data) {
        return success(data, "操作成功");
    }

    /**
     * 成功返回结果（无数据）
     *
     * @param <T>  数据类型
     * @return 结果
     */
    public static <T> Result<T> success() {
        return success(null, "操作成功");
    }

    /**
     * 成功返回结果
     *
     * @param data    数据
     * @param message 消息
     * @param <T>     数据类型
     * @return 结果
     */
    public static <T> Result<T> success(T data, String message) {
        Result<T> result = new Result<>();
        result.setCode(ResultCode.SUCCESS);
        result.setMessage(message);
        result.setData(data);
        return result;
    }

    /**
     * 失败返回结果
     *
     * @param errorCode 错误码
     * @param <T>       数据类型
     * @return 结果
     */
    public static <T> Result<T> failed(Integer errorCode, String message) {
        Result<T> result = new Result<>();
        result.setCode(errorCode);
        result.setMessage(message);
        return result;
    }

    /**
     * 失败返回结果
     *
     * @param message 错误信息
     * @param <T>     数据类型
     * @return 结果
     */
    public static <T> Result<T> failed(String message) {
        return failed(ResultCode.FAILED, message);
    }

    /**
     * 失败返回结果
     *
     * @param <T> 数据类型
     * @return 结果
     */
    public static <T> Result<T> failed() {
        return failed("操作失败");
    }

    /**
     * 参数验证失败返回结果
     *
     * @param <T> 数据类型
     * @return 结果
     */
    public static <T> Result<T> validateFailed() {
        return failed(ResultCode.VALIDATE_FAILED, "参数验证失败");
    }

    /**
     * 参数验证失败返回结果
     *
     * @param message 错误信息
     * @param <T>     数据类型
     * @return 结果
     */
    public static <T> Result<T> validateFailed(String message) {
        return failed(ResultCode.VALIDATE_FAILED, message);
    }

    /**
     * 未登录返回结果
     *
     * @param <T> 数据类型
     * @return 结果
     */
    public static <T> Result<T> unauthorized() {
        return failed(ResultCode.UNAUTHORIZED, "暂未登录或token已经过期");
    }

    /**
     * 未授权返回结果
     *
     * @param <T> 数据类型
     * @return 结果
     */
    public static <T> Result<T> forbidden() {
        return failed(ResultCode.FORBIDDEN, "没有相关权限");
    }
}