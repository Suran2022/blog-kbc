package com.blog.exception;

import com.blog.common.Result;
import com.blog.common.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.Set;

/**
 * 全局异常处理器
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理自定义异常
     */
    @ExceptionHandler(BlogException.class)
    public Result<Void> handleBlogException(BlogException e) {
        log.error("自定义异常：{}", e.getMessage(), e);
        return Result.failed(e.getCode(), e.getMessage());
    }

    /**
     * 处理参数校验异常（@Valid）
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("参数校验异常：{}", e.getMessage(), e);
        BindingResult bindingResult = e.getBindingResult();
        StringBuilder sb = new StringBuilder("参数校验失败：");
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            sb.append(fieldError.getField()).append("：").append(fieldError.getDefaultMessage()).append("，");
        }
        String msg = sb.toString();
        if (msg.endsWith("，")) {
            msg = msg.substring(0, msg.length() - 1);
        }
        return Result.validateFailed(msg);
    }

    /**
     * 处理参数校验异常（@Validated）
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleConstraintViolationException(ConstraintViolationException e) {
        log.error("参数校验异常：{}", e.getMessage(), e);
        Set<ConstraintViolation<?>> violations = e.getConstraintViolations();
        StringBuilder sb = new StringBuilder("参数校验失败：");
        for (ConstraintViolation<?> violation : violations) {
            sb.append(violation.getPropertyPath()).append("：").append(violation.getMessage()).append("，");
        }
        String msg = sb.toString();
        if (msg.endsWith("，")) {
            msg = msg.substring(0, msg.length() - 1);
        }
        return Result.validateFailed(msg);
    }

    /**
     * 处理参数绑定异常
     */
    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleBindException(BindException e) {
        log.error("参数绑定异常：{}", e.getMessage(), e);
        BindingResult bindingResult = e.getBindingResult();
        StringBuilder sb = new StringBuilder("参数绑定失败：");
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            sb.append(fieldError.getField()).append("：").append(fieldError.getDefaultMessage()).append("，");
        }
        String msg = sb.toString();
        if (msg.endsWith("，")) {
            msg = msg.substring(0, msg.length() - 1);
        }
        return Result.validateFailed(msg);
    }

    /**
     * 处理认证异常
     */
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Result<Void> handleAuthenticationException(AuthenticationException e) {
        log.error("认证异常：{}", e.getMessage(), e);
        if (e instanceof BadCredentialsException) {
            return Result.failed(ResultCode.UNAUTHORIZED, "用户名或密码错误");
        }
        return Result.unauthorized();
    }

    /**
     * 处理授权异常
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Result<Void> handleAccessDeniedException(AccessDeniedException e) {
        log.error("授权异常：{}", e.getMessage(), e);
        return Result.forbidden();
    }

    /**
     * 处理文件上传大小超限异常
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e) {
        log.error("文件上传大小超限异常：{}", e.getMessage(), e);
        return Result.failed(ResultCode.VALIDATE_FAILED, "上传文件大小超过限制");
    }

    /**
     * 处理数据库相关异常
     */
    @ExceptionHandler({java.sql.SQLException.class, org.springframework.dao.DataAccessException.class, javax.persistence.PersistenceException.class})
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Void> handleDatabaseException(Exception e) {
        log.error("数据库操作异常：{}", e.getMessage(), e);
        
        if (e instanceof java.sql.SQLException) {
            java.sql.SQLException sqlEx = (java.sql.SQLException) e;
            log.error("SQL状态: {}", sqlEx.getSQLState());
            log.error("错误代码: {}", sqlEx.getErrorCode());
            
            // 检查是否是访问权限问题
            if (sqlEx.getMessage().contains("Access denied") || sqlEx.getMessage().contains("拒绝访问")) {
                return Result.failed(ResultCode.FAILED, "数据库访问权限错误，请检查用户名和密码配置");
            }
            
            // 检查是否是连接问题
            if (sqlEx.getMessage().contains("Communications link failure") || 
                sqlEx.getMessage().contains("Connection refused")) {
                return Result.failed(ResultCode.FAILED, "无法连接到数据库服务器，请确保MySQL服务已启动");
            }
            
            // 检查是否是数据库不存在问题
            if (sqlEx.getMessage().contains("Unknown database") || 
                sqlEx.getMessage().contains("未知数据库")) {
                return Result.failed(ResultCode.FAILED, "数据库不存在，请先创建数据库");
            }
        }
        
        return Result.failed("数据库操作异常，请联系管理员");
    }
    
    /**
     * 处理其他异常
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常：{}", e.getMessage(), e);
        return Result.failed("系统异常，请联系管理员");
    }
}