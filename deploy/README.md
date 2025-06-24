# 博客系统部署指南

本文档详细介绍如何部署基于Vue+Spring Boot的博客系统。

## 目录结构

```
deploy/
├── docker-compose.yml          # 开发环境Docker配置
├── docker-compose.prod.yml     # 生产环境Docker配置
├── deploy.sh                   # 自动化部署脚本
├── .env.example               # 环境变量配置示例
├── mysql/
│   ├── init.sql               # 数据库初始化脚本
│   └── my.cnf                 # MySQL配置文件
├── redis/
│   └── redis.conf             # Redis配置文件
├── nginx/
│   └── nginx.prod.conf        # 生产环境Nginx配置
├── monitoring/
│   └── prometheus.yml         # Prometheus监控配置
└── README.md                  # 本文档
```

## 系统要求

### 硬件要求
- **最低配置**: 2核CPU, 4GB内存, 20GB存储空间
- **推荐配置**: 4核CPU, 8GB内存, 50GB存储空间

### 软件要求
- Docker 20.10+
- Docker Compose 1.29+
- Git
- 操作系统: Linux (推荐 Ubuntu 20.04+, CentOS 7+)

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd block
```

### 2. 配置环境变量

```bash
cd deploy
cp .env.example .env
vim .env  # 编辑环境变量
```

**重要**: 请务必修改以下敏感信息:
- `MYSQL_ROOT_PASSWORD`: MySQL root密码
- `MYSQL_PASSWORD`: MySQL用户密码
- `REDIS_PASSWORD`: Redis密码
- `JWT_SECRET`: JWT密钥 (建议64位随机字符串)
- `GRAFANA_PASSWORD`: Grafana管理员密码

### 3. 一键部署

```bash
# 开发环境部署
./deploy.sh deploy dev

# 生产环境部署
./deploy.sh deploy prod
```

### 4. 访问系统

部署完成后，可以通过以下地址访问:
- **前端**: http://localhost (HTTPS: https://localhost)
- **后端API**: http://localhost/api
- **管理后台**: http://localhost/admin
- **监控面板**: http://localhost:3000 (Grafana, 仅生产环境)

## 详细部署步骤

### 开发环境部署

开发环境适用于本地开发和测试:

```bash
# 1. 构建并启动服务
./deploy.sh deploy dev

# 2. 查看服务状态
./deploy.sh status

# 3. 查看日志
./deploy.sh logs

# 4. 停止服务
./deploy.sh stop
```

### 生产环境部署

生产环境包含完整的监控和安全配置:

```bash
# 1. 配置环境变量
vim .env

# 2. 生成SSL证书 (可选，脚本会自动生成自签名证书)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/blog.key \
    -out ssl/blog.crt

# 3. 部署生产环境
./deploy.sh deploy prod

# 4. 启用监控服务 (可选)
docker-compose -f docker-compose.prod.yml --profile monitoring up -d
```

## 部署脚本使用说明

`deploy.sh` 脚本提供了完整的部署管理功能:

```bash
# 完整部署
./deploy.sh deploy [dev|prod]

# 启动服务
./deploy.sh start [dev|prod]

# 停止服务
./deploy.sh stop

# 重启服务
./deploy.sh restart [dev|prod]

# 查看状态
./deploy.sh status

# 查看日志
./deploy.sh logs [service_name]

# 清理资源
./deploy.sh cleanup

# 显示帮助
./deploy.sh help
```

## 配置说明

### 数据库配置

数据库初始化脚本 `mysql/init.sql` 包含:
- 完整的表结构定义
- 初始管理员账户 (用户名: admin, 密码: admin123)
- 默认分类和标签数据
- 系统设置初始值

### 缓存配置

Redis配置 `redis/redis.conf` 包含:
- 内存优化设置
- 持久化配置
- 安全设置
- 性能调优参数

### Web服务器配置

Nginx配置 `nginx/nginx.prod.conf` 包含:
- HTTPS重定向
- 静态资源缓存
- API反向代理
- 安全头设置
- 速率限制
- Gzip压缩

## 监控配置

### Prometheus监控

监控指标包括:
- 应用性能指标 (JVM, HTTP请求)
- 系统资源指标 (CPU, 内存, 磁盘)
- 数据库性能指标
- 缓存性能指标
- Web服务器指标

### Grafana面板

预配置的监控面板:
- 系统概览
- 应用性能
- 数据库监控
- 错误率统计
- 用户行为分析

## 安全配置

### SSL/TLS
- 强制HTTPS重定向
- 现代TLS协议支持
- HSTS安全头
- 安全密码套件

### 应用安全
- JWT令牌认证
- CSRF保护
- XSS防护
- SQL注入防护
- 速率限制

### 网络安全
- 容器网络隔离
- 端口访问控制
- 防火墙规则
- 日志审计

## 备份与恢复

### 数据备份

```bash
# 数据库备份
docker exec blog-mysql-prod mysqldump -u root -p blog > backup_$(date +%Y%m%d).sql

# 文件备份
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/

# Redis备份
docker exec blog-redis-prod redis-cli BGSAVE
```

### 数据恢复

```bash
# 数据库恢复
docker exec -i blog-mysql-prod mysql -u root -p blog < backup_20231201.sql

# 文件恢复
tar -xzf uploads_backup_20231201.tar.gz
```

## 故障排除

### 常见问题

1. **容器启动失败**
   ```bash
   # 查看容器日志
   docker logs blog-backend-prod
   
   # 检查容器状态
   docker ps -a
   ```

2. **数据库连接失败**
   ```bash
   # 检查数据库状态
   docker exec blog-mysql-prod mysql -u root -p -e "SHOW DATABASES;"
   
   # 检查网络连接
   docker exec blog-backend-prod ping blog-mysql-prod
   ```

3. **前端页面无法访问**
   ```bash
   # 检查Nginx配置
   docker exec blog-frontend-prod nginx -t
   
   # 重新加载Nginx配置
   docker exec blog-frontend-prod nginx -s reload
   ```

4. **API请求失败**
   ```bash
   # 检查后端服务健康状态
   curl http://localhost/api/actuator/health
   
   # 查看后端日志
   docker logs blog-backend-prod
   ```

### 性能优化

1. **数据库优化**
   - 调整缓冲池大小
   - 优化查询索引
   - 配置慢查询日志

2. **缓存优化**
   - 调整Redis内存限制
   - 配置缓存过期策略
   - 监控缓存命中率

3. **Web服务器优化**
   - 调整worker进程数
   - 配置连接池
   - 启用HTTP/2

## 更新部署

### 应用更新

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建并部署
./deploy.sh deploy prod

# 3. 验证更新
curl http://localhost/api/actuator/info
```

### 滚动更新

```bash
# 1. 构建新镜像
docker-compose -f docker-compose.prod.yml build

# 2. 逐个更新服务
docker-compose -f docker-compose.prod.yml up -d --no-deps backend
docker-compose -f docker-compose.prod.yml up -d --no-deps frontend
```

## 联系支持

如果在部署过程中遇到问题，请:
1. 查看相关日志文件
2. 检查系统资源使用情况
3. 参考故障排除章节
4. 提交Issue并附上详细的错误信息

---

**注意**: 在生产环境中部署前，请务必:
- 修改所有默认密码
- 配置适当的SSL证书
- 设置防火墙规则
- 配置监控告警
- 制定备份策略