#!/bin/bash

# 博客系统部署脚本
# 使用方法: ./deploy.sh [dev|prod]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Docker是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose未安装，请先安装Docker Compose"
        exit 1
    fi
    
    log_success "Docker环境检查通过"
}

# 检查项目文件
check_project_files() {
    local required_files=(
        "../blog-backend/pom.xml"
        "../blog-frontend/blog-app/package.json"
        "docker-compose.yml"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            log_error "缺少必要文件: $file"
            exit 1
        fi
    done
    
    log_success "项目文件检查通过"
}

# 构建后端项目
build_backend() {
    log_info "开始构建后端项目..."
    
    cd ../blog-backend
    
    # 检查Maven是否安装
    if ! command -v mvn &> /dev/null; then
        log_error "Maven未安装，请先安装Maven"
        exit 1
    fi
    
    # 清理并构建
    mvn clean package -DskipTests
    
    if [[ $? -eq 0 ]]; then
        log_success "后端项目构建成功"
    else
        log_error "后端项目构建失败"
        exit 1
    fi
    
    cd ../deploy
}

# 构建前端项目
build_frontend() {
    log_info "开始构建前端项目..."
    
    cd ../blog-frontend/blog-app
    
    # 检查Node.js是否安装
    if ! command -v node &> /dev/null; then
        log_error "Node.js未安装，请先安装Node.js"
        exit 1
    fi
    
    # 检查npm是否安装
    if ! command -v npm &> /dev/null; then
        log_error "npm未安装，请先安装npm"
        exit 1
    fi
    
    # 安装依赖
    npm install
    
    # 构建项目
    npm run build
    
    if [[ $? -eq 0 ]]; then
        log_success "前端项目构建成功"
    else
        log_error "前端项目构建失败"
        exit 1
    fi
    
    cd ../../deploy
}

# 创建必要的目录
create_directories() {
    log_info "创建必要的目录..."
    
    local directories=(
        "logs"
        "logs/nginx"
        "uploads"
        "ssl"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
    done
    
    log_success "目录创建完成"
}

# 生成SSL证书（自签名，仅用于测试）
generate_ssl_cert() {
    log_info "生成SSL证书..."
    
    if [[ ! -f "ssl/blog.crt" ]] || [[ ! -f "ssl/blog.key" ]]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/blog.key \
            -out ssl/blog.crt \
            -subj "/C=CN/ST=Beijing/L=Beijing/O=Blog/OU=IT/CN=localhost"
        
        log_success "SSL证书生成完成"
    else
        log_info "SSL证书已存在，跳过生成"
    fi
}

# 启动服务
start_services() {
    local env=${1:-dev}
    
    log_info "启动服务 (环境: $env)..."
    
    # 停止现有服务
    docker-compose down
    
    # 启动服务
    if [[ "$env" == "prod" ]]; then
        docker-compose up -d
    else
        docker-compose up
    fi
    
    if [[ $? -eq 0 ]]; then
        log_success "服务启动成功"
        log_info "前端访问地址: http://localhost"
        log_info "后端API地址: http://localhost/api"
    else
        log_error "服务启动失败"
        exit 1
    fi
}

# 停止服务
stop_services() {
    log_info "停止服务..."
    docker-compose down
    log_success "服务已停止"
}

# 查看服务状态
show_status() {
    log_info "服务状态:"
    docker-compose ps
}

# 查看日志
show_logs() {
    local service=${1:-}
    
    if [[ -n "$service" ]]; then
        docker-compose logs -f "$service"
    else
        docker-compose logs -f
    fi
}

# 清理资源
cleanup() {
    log_info "清理Docker资源..."
    
    # 停止服务
    docker-compose down
    
    # 删除未使用的镜像
    docker image prune -f
    
    # 删除未使用的卷
    docker volume prune -f
    
    log_success "清理完成"
}

# 主函数
main() {
    local command=${1:-deploy}
    local env=${2:-dev}
    
    case "$command" in
        "deploy")
            log_info "开始部署博客系统..."
            check_docker
            check_project_files
            build_backend
            build_frontend
            create_directories
            generate_ssl_cert
            start_services "$env"
            ;;
        "start")
            start_services "$env"
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            stop_services
            start_services "$env"
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs "$env"
            ;;
        "cleanup")
            cleanup
            ;;
        "help")
            echo "使用方法:"
            echo "  $0 deploy [dev|prod]  - 完整部署"
            echo "  $0 start [dev|prod]   - 启动服务"
            echo "  $0 stop              - 停止服务"
            echo "  $0 restart [dev|prod] - 重启服务"
            echo "  $0 status            - 查看状态"
            echo "  $0 logs [service]    - 查看日志"
            echo "  $0 cleanup           - 清理资源"
            echo "  $0 help              - 显示帮助"
            ;;
        *)
            log_error "未知命令: $command"
            echo "使用 '$0 help' 查看帮助"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"