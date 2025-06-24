package com.blog.util;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 性能监控工具
 * 提供方法执行时间监控和性能分析
 */
@Slf4j
@Aspect
@Component
public class PerformanceMonitor {

    /**
     * 性能监控注解
     * 用于标记需要监控性能的方法
     */
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface Monitor {
        /**
         * 监控描述
         */
        String value() default "";
        
        /**
         * 是否记录参数
         */
        boolean logArgs() default false;
        
        /**
         * 是否记录返回值
         */
        boolean logResult() default false;
        
        /**
         * 慢查询阈值（毫秒）
         */
        long slowThreshold() default 1000;
    }

    /**
     * 监控所有标记了@Monitor注解的方法
     */
    @Around("@annotation(monitor)")
    public Object monitorPerformance(ProceedingJoinPoint joinPoint, Monitor monitor) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        String description = monitor.value().isEmpty() ? methodName : monitor.value();
        
        long startTime = System.currentTimeMillis();
        
        try {
            // 记录方法开始执行
            if (monitor.logArgs()) {
                log.info("[性能监控] 开始执行: {} - 参数: {}", description, joinPoint.getArgs());
            } else {
                log.info("[性能监控] 开始执行: {}", description);
            }
            
            // 执行目标方法
            Object result = joinPoint.proceed();
            
            // 计算执行时间
            long executionTime = System.currentTimeMillis() - startTime;
            
            // 记录执行结果
            if (executionTime > monitor.slowThreshold()) {
                log.warn("[性能监控] 慢查询警告: {} - 执行时间: {}ms (超过阈值: {}ms)", 
                    description, executionTime, monitor.slowThreshold());
            } else {
                log.info("[性能监控] 执行完成: {} - 执行时间: {}ms", description, executionTime);
            }
            
            if (monitor.logResult()) {
                log.info("[性能监控] 返回结果: {} - 结果: {}", description, result);
            }
            
            return result;
            
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            log.error("[性能监控] 执行异常: {} - 执行时间: {}ms - 异常: {}", 
                description, executionTime, e.getMessage());
            throw e;
        }
    }

    /**
     * 监控所有Service层方法
     */
    @Around("execution(* com.blog.service..*(..))") 
    public Object monitorServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;
            
            if (executionTime > 500) { // 超过500ms记录警告
                log.warn("[Service监控] 慢方法: {} - 执行时间: {}ms", methodName, executionTime);
            } else if (log.isDebugEnabled()) {
                log.debug("[Service监控] {}: {}ms", methodName, executionTime);
            }
            
            return result;
            
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            log.error("[Service监控] 方法异常: {} - 执行时间: {}ms - 异常: {}", 
                methodName, executionTime, e.getMessage());
            throw e;
        }
    }

    /**
     * 监控所有Repository层方法
     */
    @Around("execution(* com.blog.repository..*(..))") 
    public Object monitorRepositoryMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;
            
            if (executionTime > 200) { // 超过200ms记录警告
                log.warn("[Repository监控] 慢查询: {} - 执行时间: {}ms", methodName, executionTime);
            } else if (log.isDebugEnabled()) {
                log.debug("[Repository监控] {}: {}ms", methodName, executionTime);
            }
            
            return result;
            
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            log.error("[Repository监控] 查询异常: {} - 执行时间: {}ms - 异常: {}", 
                methodName, executionTime, e.getMessage());
            throw e;
        }
    }
}