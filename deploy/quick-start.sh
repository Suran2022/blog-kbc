#!/bin/bash

# 博客系统快速启动脚本
# 使用方法: ./quick-start.sh [COMMAND] [OPTIONS]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 配置
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$SCRIPT_DIR/.env"
DEV_ENV_FILE="$SCRIPT_DIR/.env.dev"
COMMAND="${1:-help}"
ENVIRONMENT="${2:-dev}"
SERVICES="${3:-all}"

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

log_step() {
    echo -e "${MAGENTA}[STEP]${NC} $1"
}

# 显示帮助信息
show_help() {
    echo "博客系统快速启动脚本"
    echo "==========================================="
    echo ""
    echo "使用方法: $0 [COMMAND] [ENVIRONMENT] [SERVICES]"
    echo ""
    echo "命令 (COMMAND):"
    echo "  help          显示帮助信息"
    echo "  init          初始化项目环境"
    echo "  start         启动服务"
    echo "  stop          停止服务"
    echo "  restart       重启服务"
    echo "  status        查看服务状态"
    echo "  logs          查看服务日志"
    echo "  clean         清理环境"
    echo "  build         构建镜像"
    echo "  migrate       执行数据库迁移"
    echo "  backup        备份数据"
    echo "  restore       恢复数据"
    echo "  test          运行测试"
    echo "  monitor       启动监控"
    echo ""
    echo "环境 (ENVIRONMENT):"
    echo "  dev           开发环境 (默认)"
    echo "  prod          生产环境"
    echo ""
    echo "服务 (SERVICES):"
    echo "  all           所有服务 (默认)"
    echo "  db            数据库服务 (mysql, redis)"
    echo "  app           应用服务 (backend, frontend)"
    echo "  web           Web服务 (nginx)"
    echo "  tools         开发工具 (adminer, mailhog等)"
    echo "  search        搜索服务 (elasticsearch, kibana)"
    echo "  monitor       监控服务 (prometheus, grafana)"
    echo ""
    echo "示例:"
    echo "  $0 init                    # 初始化开发环境"
    echo "  $0 start dev               # 启动开发环境所有服务"
    echo "  $0 start dev db            # 启动开发环境数据库服务"
    echo "  $0 start prod              # 启动生产环境"
    echo "  $0 logs dev backend        # 查看开发环境后端日志"
    echo "  $0 migrate dev             # 执行开发环境数据库迁移"
    echo "  $0 clean dev               # 清理开发环境"
    echo ""
}

# 检查依赖
check_dependencies() {
    log_step "检查依赖..."
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker未运行，请启动Docker"
        exit 1
    fi
    
    # 检查Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose未安装，请先安装Docker Compose"
        exit 1
    fi
    
    log_success "依赖检查通过"
}

# 初始化环境
init_environment() {
    log_step "初始化环境..."
    
    # 创建必要目录
    mkdir -p "$SCRIPT_DIR/logs/mysql"
    mkdir -p "$SCRIPT_DIR/logs/redis"
    mkdir -p "$SCRIPT_DIR/logs/nginx"
    mkdir -p "$SCRIPT_DIR/logs/backend"
    mkdir -p "$SCRIPT_DIR/logs/frontend"
    mkdir -p "$SCRIPT_DIR/logs/elasticsearch"
    mkdir -p "$SCRIPT_DIR/backups"
    mkdir -p "$SCRIPT_DIR/uploads"
    
    # 复制环境配置文件
    if [[ "$ENVIRONMENT" == "dev" ]]; then
        if [[ ! -f "$ENV_FILE" ]]; then
            cp "$DEV_ENV_FILE" "$ENV_FILE"
            log_success "已创建开发环境配置文件: $ENV_FILE"
        else
            log_info "环境配置文件已存在: $ENV_FILE"
        fi
    else
        if [[ ! -f "$ENV_FILE" ]]; then
            cp "$SCRIPT_DIR/.env.example" "$ENV_FILE"
            log_warning "已创建生产环境配置文件: $ENV_FILE，请根据实际情况修改配置"
        else
            log_info "环境配置文件已存在: $ENV_FILE"
        fi
    fi
    
    # 设置文件权限
    chmod +x "$SCRIPT_DIR"/*.sh
    
    log_success "环境初始化完成"
}

# 获取Docker Compose文件
get_compose_file() {
    if [[ "$ENVIRONMENT" == "prod" ]]; then
        echo "$SCRIPT_DIR/docker-compose.prod.yml"
    else
        echo "$SCRIPT_DIR/docker-compose.dev.yml"
    fi
}

# 获取服务列表
get_services() {
    case "$SERVICES" in
        "all")
            if [[ "$ENVIRONMENT" == "prod" ]]; then
                echo ""
            else
                echo ""
            fi
            ;;
        "db")
            if [[ "$ENVIRONMENT" == "prod" ]]; then
                echo "mysql-prod redis-prod"
            else
                echo "mysql-dev redis-dev"
            fi
            ;;
        "app")
            if [[ "$ENVIRONMENT" == "prod" ]]; then
                echo "backend-prod frontend-prod"
            else
                echo "backend-dev frontend-dev"
            fi
            ;;
        "web")
            if [[ "$ENVIRONMENT" == "prod" ]]; then
                echo "nginx-prod"
            else
                echo "nginx-dev"
            fi
            ;;
        "tools")
            if [[ "$ENVIRONMENT" == "dev" ]]; then
                echo "adminer redis-commander mailhog"
            else
                echo ""
            fi
            ;;
        "search")
            echo "elasticsearch kibana"
            ;;
        "monitor")
            echo "prometheus grafana"
            ;;
        *)
            echo "$SERVICES"
            ;;
    esac
}

# 启动服务
start_services() {
    log_step "启动 $ENVIRONMENT 环境服务..."
    
    local compose_file=$(get_compose_file)
    local services=$(get_services)
    
    if [[ ! -f "$compose_file" ]]; then
        log_error "Docker Compose文件不存在: $compose_file"
        exit 1
    fi
    
    cd "$SCRIPT_DIR"
    
    # 启动服务
    if [[ -n "$services" ]]; then
        log_info "启动服务: $services"
        docker-compose -f "$compose_file" --env-file "$ENV_FILE" up -d $services
    else
        log_info "启动所有服务"
        docker-compose -f "$compose_file" --env-file "$ENV_FILE" up -d
    fi
    
    # 等待服务启动
    sleep 5
    
    # 显示服务状态
    show_status
    
    # 显示访问地址
    show_urls
    
    log_success "服务启动完成"
}

# 停止服务
stop_services() {
    log_step "停止 $ENVIRONMENT 环境服务..."
    
    local compose_file=$(get_compose_file)
    local services=$(get_services)
    
    cd "$SCRIPT_DIR"
    
    if [[ -n "$services" ]]; then
        log_info "停止服务: $services"
        docker-compose -f "$compose_file" stop $services
    else
        log_info "停止所有服务"
        docker-compose -f "$compose_file" stop
    fi
    
    log_success "服务停止完成"
}

# 重启服务
restart_services() {
    log_step "重启 $ENVIRONMENT 环境服务..."
    
    stop_services
    sleep 2
    start_services
    
    log_success "服务重启完成"
}

# 显示服务状态
show_status() {
    log_step "查看 $ENVIRONMENT 环境服务状态..."
    
    local compose_file=$(get_compose_file)
    
    cd "$SCRIPT_DIR"
    docker-compose -f "$compose_file" ps
}

# 查看日志
show_logs() {
    log_step "查看 $ENVIRONMENT 环境服务日志..."
    
    local compose_file=$(get_compose_file)
    local services=$(get_services)
    
    cd "$SCRIPT_DIR"
    
    if [[ -n "$services" ]]; then
        docker-compose -f "$compose_file" logs -f --tail=100 $services
    else
        docker-compose -f "$compose_file" logs -f --tail=100
    fi
}

# 清理环境
clean_environment() {
    log_step "清理 $ENVIRONMENT 环境..."
    
    local compose_file=$(get_compose_file)
    
    cd "$SCRIPT_DIR"
    
    # 停止并删除容器
    docker-compose -f "$compose_file" down -v --remove-orphans
    
    # 清理镜像（可选）
    read -p "是否清理相关Docker镜像？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker image prune -f
        log_info "已清理未使用的镜像"
    fi
    
    log_success "环境清理完成"
}

# 构建镜像
build_images() {
    log_step "构建 $ENVIRONMENT 环境镜像..."
    
    local compose_file=$(get_compose_file)
    
    cd "$SCRIPT_DIR"
    docker-compose -f "$compose_file" build --no-cache
    
    log_success "镜像构建完成"
}

# 执行数据库迁移
run_migration() {
    log_step "执行 $ENVIRONMENT 环境数据库迁移..."
    
    if [[ ! -f "$SCRIPT_DIR/migrate.sh" ]]; then
        log_error "迁移脚本不存在: $SCRIPT_DIR/migrate.sh"
        exit 1
    fi
    
    "$SCRIPT_DIR/migrate.sh" --action=up
    
    log_success "数据库迁移完成"
}

# 备份数据
backup_data() {
    log_step "备份 $ENVIRONMENT 环境数据..."
    
    if [[ ! -f "$SCRIPT_DIR/backup.sh" ]]; then
        log_error "备份脚本不存在: $SCRIPT_DIR/backup.sh"
        exit 1
    fi
    
    "$SCRIPT_DIR/backup.sh" --type=all --compress
    
    log_success "数据备份完成"
}

# 恢复数据
restore_data() {
    log_step "恢复 $ENVIRONMENT 环境数据..."
    
    if [[ ! -f "$SCRIPT_DIR/restore.sh" ]]; then
        log_error "恢复脚本不存在: $SCRIPT_DIR/restore.sh"
        exit 1
    fi
    
    "$SCRIPT_DIR/restore.sh"
    
    log_success "数据恢复完成"
}

# 运行测试
run_tests() {
    log_step "运行 $ENVIRONMENT 环境测试..."
    
    if [[ ! -f "$SCRIPT_DIR/performance-test.sh" ]]; then
        log_error "测试脚本不存在: $SCRIPT_DIR/performance-test.sh"
        exit 1
    fi
    
    "$SCRIPT_DIR/performance-test.sh" --test-type=basic
    
    log_success "测试运行完成"
}

# 启动监控
start_monitoring() {
    log_step "启动 $ENVIRONMENT 环境监控..."
    
    if [[ ! -f "$SCRIPT_DIR/monitor.sh" ]]; then
        log_error "监控脚本不存在: $SCRIPT_DIR/monitor.sh"
        exit 1
    fi
    
    "$SCRIPT_DIR/monitor.sh" --interval=30 --output=console &
    
    log_success "监控启动完成"
}

# 显示访问地址
show_urls() {
    echo ""
    log_info "服务访问地址:"
    
    if [[ "$ENVIRONMENT" == "dev" ]]; then
        echo "  前端应用:        http://localhost:3000"
        echo "  后端API:         http://localhost:8080"
        echo "  Nginx代理:       http://localhost"
        echo "  数据库管理:      http://localhost:8081"
        echo "  Redis管理:       http://localhost:8082"
        echo "  邮件测试:        http://localhost:8025"
        echo "  健康检查:        http://localhost/health"
    else
        echo "  应用首页:        https://your-domain.com"
        echo "  后端API:         https://your-domain.com/api"
        echo "  监控面板:        https://your-domain.com:3001"
        echo "  健康检查:        https://your-domain.com/health"
    fi
    
    echo ""
}

# 主函数
main() {
    echo "博客系统快速启动脚本"
    echo "==========================================="
    echo "命令: $COMMAND"
    echo "环境: $ENVIRONMENT"
    echo "服务: $SERVICES"
    echo ""
    
    case "$COMMAND" in
        "help")
            show_help
            ;;
        "init")
            check_dependencies
            init_environment
            ;;
        "start")
            check_dependencies
            start_services
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs
            ;;
        "clean")
            clean_environment
            ;;
        "build")
            check_dependencies
            build_images
            ;;
        "migrate")
            run_migration
            ;;
        "backup")
            backup_data
            ;;
        "restore")
            restore_data
            ;;
        "test")
            run_tests
            ;;
        "monitor")
            start_monitoring
            ;;
        *)
            log_error "未知命令: $COMMAND"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"