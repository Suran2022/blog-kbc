package com.blog.config;

import com.blog.entity.User;
import com.blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * 数据初始化类
 * 用于在应用启动时初始化必要的数据
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("========== 开始初始化数据 ==========");
        
        // 检查是否已存在管理员账户
        Optional<User> existingAdminOpt = userRepository.findByUsername("admin");
        
        if (existingAdminOpt.isEmpty()) {
            // 创建默认管理员账户
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNickname("管理员");
            admin.setAvatar("https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png");
            admin.setEmail("admin@example.com");
            admin.setStatus(1);
            
            userRepository.save(admin);
            
            System.out.println("已创建默认管理员账户: admin / admin123");
        } else {
            System.out.println("管理员账户已存在，跳过创建");
        }
        
        System.out.println("========== 数据初始化完成 ==========");
    }
}