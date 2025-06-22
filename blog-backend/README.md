# 博客系统后端

这是一个基于Spring Boot的博客系统后端项目，提供了用户管理、文章管理、分类管理、贡献者管理和系统设置等功能。

## 技术栈

- Spring Boot 2.7.x
- Spring Security
- Spring Data JPA
- MySQL 8.0
- JWT认证
- Swagger/OpenAPI 3.0

## 功能特性

- 用户认证与授权
- 文章的CRUD操作
- 分类管理
- 贡献者管理
- 系统设置
- 文件上传

## 项目结构

```
src/main/java/com/blog/
├── BlogApplication.java                # 应用程序入口
├── common/                             # 通用类
│   ├── PageResult.java                 # 分页结果
│   ├── Result.java                     # 统一响应结果
│   └── ResultCode.java                 # 响应状态码
├── config/                             # 配置类
│   ├── SecurityConfig.java             # 安全配置
│   ├── SwaggerConfig.java              # Swagger配置
│   └── WebMvcConfig.java               # Web MVC配置
├── controller/                         # 控制器
│   ├── ArticleController.java          # 文章控制器
│   ├── AuthController.java             # 认证控制器
│   ├── CategoryController.java         # 分类控制器
│   ├── ContributorController.java      # 贡献者控制器
│   ├── FileController.java             # 文件上传控制器
│   ├── SettingController.java          # 系统设置控制器
│   └── UserController.java             # 用户控制器
├── dto/                                # 数据传输对象
│   ├── ArticleDTO.java                 # 文章DTO
│   ├── CategoryDTO.java                # 分类DTO
│   ├── ContributorDTO.java             # 贡献者DTO
│   ├── LoginDTO.java                   # 登录DTO
│   ├── SettingDTO.java                 # 系统设置DTO
│   └── UserDTO.java                    # 用户DTO
├── entity/                             # 实体类
│   ├── Article.java                    # 文章实体
│   ├── Category.java                   # 分类实体
│   ├── Contributor.java                # 贡献者实体
│   ├── Setting.java                    # 系统设置实体
│   └── User.java                       # 用户实体
├── exception/                          # 异常处理
│   ├── BlogException.java              # 自定义异常
│   └── GlobalExceptionHandler.java     # 全局异常处理器
├── repository/                         # 数据访问层
│   ├── ArticleRepository.java          # 文章数据访问接口
│   ├── CategoryRepository.java         # 分类数据访问接口
│   ├── ContributorRepository.java      # 贡献者数据访问接口
│   ├── SettingRepository.java          # 系统设置数据访问接口
│   └── UserRepository.java             # 用户数据访问接口
├── security/                           # 安全相关
│   ├── JwtAuthenticationEntryPoint.java # JWT认证入口点
│   ├── JwtAuthenticationFilter.java    # JWT认证过滤器
│   ├── JwtUserDetails.java             # JWT用户详情
│   └── JwtUserDetailsService.java      # JWT用户详情服务
├── service/                            # 服务层
│   ├── ArticleService.java             # 文章服务接口
│   ├── AuthService.java                # 认证服务接口
│   ├── CategoryService.java            # 分类服务接口
│   ├── ContributorService.java         # 贡献者服务接口
│   ├── FileService.java                # 文件服务接口
│   ├── SettingService.java             # 系统设置服务接口
│   ├── UserService.java                # 用户服务接口
│   └── impl/                           # 服务实现
│       ├── ArticleServiceImpl.java     # 文章服务实现
│       ├── AuthServiceImpl.java        # 认证服务实现
│       ├── CategoryServiceImpl.java    # 分类服务实现
│       ├── ContributorServiceImpl.java # 贡献者服务实现
│       ├── FileServiceImpl.java        # 文件服务实现
│       ├── SettingServiceImpl.java     # 系统设置服务实现
│       └── UserServiceImpl.java        # 用户服务实现
├── util/                               # 工具类
│   ├── FileUtil.java                   # 文件工具类
│   └── JwtUtil.java                    # JWT工具类
└── vo/                                 # 视图对象
    ├── ArticleVO.java                  # 文章视图对象
    ├── CategoryVO.java                 # 分类视图对象
    ├── ContributorVO.java              # 贡献者视图对象
    ├── LoginVO.java                    # 登录视图对象
    ├── SettingVO.java                  # 系统设置视图对象
    └── UserVO.java                     # 用户视图对象
```

## 快速开始

### 环境要求

- JDK 11+
- Maven 3.6+
- MySQL 8.0+

### 配置数据库

1. 创建数据库：

```sql
CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 修改 `application.yml` 中的数据库配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: your-username
    password: your-password
```

### 构建和运行

```bash
# 克隆项目
git clone https://github.com/yourusername/blog-backend.git
cd blog-backend

# 构建项目
mvn clean package

# 运行项目
java -jar target/blog-backend-0.0.1-SNAPSHOT.jar
```

### 访问API文档

启动应用后，访问 Swagger UI：

```
http://localhost:8081/api/swagger-ui/index.html
```

## API接口

### 认证接口

- POST /api/auth/login - 用户登录

### 用户接口

- GET /api/users/me - 获取当前用户信息
- PUT /api/users/me - 更新当前用户信息
- PUT /api/users/password - 修改密码

### 文章接口

- POST /api/articles - 创建文章
- PUT /api/articles/{id} - 更新文章
- DELETE /api/articles/{id} - 删除文章
- GET /api/articles/{id} - 获取文章详情
- GET /api/articles - 分页获取文章列表
- GET /api/articles/latest - 获取最新文章列表
- GET /api/articles/popular - 获取热门文章列表

### 分类接口

- POST /api/categories - 创建分类
- PUT /api/categories/{id} - 更新分类
- DELETE /api/categories/{id} - 删除分类
- GET /api/categories/{id} - 获取分类详情
- GET /api/categories - 获取所有分类

### 贡献者接口

- POST /api/contributors - 创建贡献者
- PUT /api/contributors/{id} - 更新贡献者
- DELETE /api/contributors/{id} - 删除贡献者
- GET /api/contributors/{id} - 获取贡献者详情
- GET /api/contributors - 获取所有贡献者

### 系统设置接口

- GET /api/settings - 获取系统设置
- PUT /api/settings - 更新系统设置

### 文件上传接口

- POST /api/files/images - 上传图片
- POST /api/files - 上传文件

## 许可证

[MIT](LICENSE)