package com.blog;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * 博客系统后端应用程序入口
 */
@SpringBootApplication
@EnableJpaAuditing
public class BlogApplication {

    private static final Logger log = LoggerFactory.getLogger(BlogApplication.class);

    public static void main(String[] args) {
        try {
            log.info("正在启动博客系统后端应用...");
            
            // 捕获启动异常并记录详细日志
            ConfigurableApplicationContext context = SpringApplication.run(BlogApplication.class, args);
            
            Environment env = context.getEnvironment();
            String protocol = "http";
            if (env.getProperty("server.ssl.key-store") != null) {
                protocol = "https";
            }
            String port = env.getProperty("server.port");
            String contextPath = env.getProperty("server.servlet.context-path", "");
            if (contextPath.isEmpty()) {
                contextPath = "/";
            }
            String hostAddress = "localhost";
            try {
                hostAddress = InetAddress.getLocalHost().getHostAddress();
            } catch (UnknownHostException e) {
                log.warn("无法确定主机地址: {}", e.getMessage());
            }
            
            log.info("");
            log.info("----------------------------------------------------------");
            log.info("应用 '{}' 已成功启动!", env.getProperty("spring.application.name"));
            log.info("访问地址:\n\t" +
                    "本地: \t\t{}://localhost:{}{}\n\t" +
                    "外部: \t\t{}://{}:{}{}\n\t",
                protocol, port, contextPath,
                protocol, hostAddress, port, contextPath);
            log.info("数据库连接: {}", env.getProperty("spring.datasource.url"));
            log.info("----------------------------------------------------------");
            log.info("");
        } catch (Exception e) {
            log.error("应用启动失败", e);
            throw e; // 重新抛出异常，确保应用退出
        }
    }
}