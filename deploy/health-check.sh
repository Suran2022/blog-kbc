#!/bin/bash

# 博客系统健康检查脚本
# 使用方法: ./health-check.sh [--verbose] [--json]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
VERBOSE=false
JSON_OUTPUT=false
TIMEOUT=10
RETRY_COUNT=3
RETRY_DELAY=2

# 服务配置
FRONTEND_URL="http://localhost"
BACKEND_URL="http://localhost/api"
MYSQL_CONTAINER="blog-mysql-prod"
REDIS_CONTAINER="blog-redis-prod"
BACKEND_CONTAINER="blog-backend-prod"
FRONTEND_CONTAINER="blog-frontend-prod"

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --json|-j)
            JSON_OUTPUT=true
            shift
            ;;
        --timeout|-t)
            TIMEOUT="$2"
            shift 2
            ;;
        --help|-h)
            echo "使用方法: $0 [选项]"
            echo "选项:"
            echo "  --verbose, -v    详细输出"
            echo "  --json, -j       JSON格式输出"
            echo "  --timeout, -t    超时时间(秒，默认10)"
            echo "  --help, -h       显示帮助"
            exit 0
            ;;
        *)
            echo "未知选项: $1"
            exit 1
            ;;
    esac
done

# 日志函数
log_info() {
    if [[ "$JSON_OUTPUT" == "false" ]]; then
        echo -e "${BLUE}[INFO]${NC} $1"
    fi
}

log_success() {
    if [[ "$JSON_OUTPUT" == "false" ]]; then
        echo -e "${GREEN}[SUCCESS]${NC} $1"
    fi
}

log_warning() {
    if [[ "$JSON_OUTPUT" == "false" ]]; then
        echo -e "${YELLOW}[WARNING]${NC} $1"
    fi
}

log_error() {
    if [[ "$JSON_OUTPUT" == "false" ]]; then
        echo -e "${RED}[ERROR]${NC} $1"
    fi
}

log_verbose() {
    if [[ "$VERBOSE" == "true" && "$JSON_OUTPUT" == "false" ]]; then
        echo -e "${NC}[DEBUG] $1"
    fi
}

# 检查结果存储
declare -A check_results
overall_status="healthy"

# HTTP请求函数
http_check() {
    local url="$1"
    local expected_status="${2:-200}"
    local description="$3"
    
    log_verbose "检查 $description: $url"
    
    local response
    local status_code
    local response_time
    
    for ((i=1; i<=RETRY_COUNT; i++)); do
        start_time=$(date +%s%N)
        
        if response=$(curl -s -w "\n%{http_code}" --max-time "$TIMEOUT" "$url" 2>/dev/null); then
            end_time=$(date +%s%N)
            response_time=$(( (end_time - start_time) / 1000000 ))
            
            status_code=$(echo "$response" | tail -n1)
            body=$(echo "$response" | head -n -1)
            
            if [[ "$status_code" == "$expected_status" ]]; then
                log_verbose "$description 响应正常 (${response_time}ms)"
                return 0
            else
                log_verbose "$description 状态码错误: $status_code (期望: $expected_status)"
            fi
        else
            log_verbose "$description 请求失败 (尝试 $i/$RETRY_COUNT)"
        fi
        
        if [[ $i -lt $RETRY_COUNT ]]; then
            sleep "$RETRY_DELAY"
        fi
    done
    
    return 1
}

# 容器状态检查
container_check() {
    local container_name="$1"
    local description="$2"
    
    log_verbose "检查容器: $container_name"
    
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "$container_name.*Up"; then
        log_verbose "$description 容器运行正常"
        return 0
    else
        log_verbose "$description 容器未运行或状态异常"
        return 1
    fi
}

# 数据库连接检查
mysql_check() {
    log_verbose "检查MySQL数据库连接"
    
    if docker exec "$MYSQL_CONTAINER" mysql -u root -p${MYSQL_ROOT_PASSWORD:-root123456} -e "SELECT 1" >/dev/null 2>&1; then
        log_verbose "MySQL数据库连接正常"
        return 0
    else
        log_verbose "MySQL数据库连接失败"
        return 1
    fi
}

# Redis连接检查
redis_check() {
    log_verbose "检查Redis连接"
    
    if docker exec "$REDIS_CONTAINER" redis-cli ping | grep -q "PONG"; then
        log_verbose "Redis连接正常"
        return 0
    else
        log_verbose "Redis连接失败"
        return 1
    fi
}

# 磁盘空间检查
disk_check() {
    log_verbose "检查磁盘空间"
    
    local usage
    usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [[ $usage -lt 90 ]]; then
        log_verbose "磁盘空间充足 (使用率: ${usage}%)"
        return 0
    else
        log_verbose "磁盘空间不足 (使用率: ${usage}%)"
        return 1
    fi
}

# 内存使用检查
memory_check() {
    log_verbose "检查内存使用"
    
    local usage
    usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    
    if [[ $usage -lt 90 ]]; then
        log_verbose "内存使用正常 (使用率: ${usage}%)"
        return 0
    else
        log_verbose "内存使用过高 (使用率: ${usage}%)"
        return 1
    fi
}

# 执行检查
run_checks() {
    log_info "开始系统健康检查..."
    
    # 容器状态检查
    if container_check "$MYSQL_CONTAINER" "MySQL"; then
        check_results["mysql_container"]="healthy"
    else
        check_results["mysql_container"]="unhealthy"
        overall_status="unhealthy"
    fi
    
    if container_check "$REDIS_CONTAINER" "Redis"; then
        check_results["redis_container"]="healthy"
    else
        check_results["redis_container"]="unhealthy"
        overall_status="unhealthy"
    fi
    
    if container_check "$BACKEND_CONTAINER" "后端应用"; then
        check_results["backend_container"]="healthy"
    else
        check_results["backend_container"]="unhealthy"
        overall_status="unhealthy"
    fi
    
    if container_check "$FRONTEND_CONTAINER" "前端应用"; then
        check_results["frontend_container"]="healthy"
    else
        check_results["frontend_container"]="unhealthy"
        overall_status="unhealthy"
    fi
    
    # 服务连接检查
    if mysql_check; then
        check_results["mysql_connection"]="healthy"
    else
        check_results["mysql_connection"]="unhealthy"
        overall_status="unhealthy"
    fi
    
    if redis_check; then
        check_results["redis_connection"]="healthy"
    else
        check_results["redis_connection"]="unhealthy"
        overall_status="unhealthy"
    fi
    
    # HTTP服务检查
    if http_check "$FRONTEND_URL/health" "200" "前端服务"; then
        check_results["frontend_http"]="healthy"
    else
        check_results["frontend_http"]="unhealthy"
        overall_status="unhealthy"
    fi
    
    if http_check "$BACKEND_URL/actuator/health" "200" "后端健康检查"; then
        check_results["backend_health"]="healthy"
    else
        check_results["backend_health"]="unhealthy"
        overall_status="unhealthy"
    fi
    
    if http_check "$BACKEND_URL/actuator/info" "200" "后端信息接口"; then
        check_results["backend_info"]="healthy"
    else
        check_results["backend_info"]="degraded"
        if [[ "$overall_status" == "healthy" ]]; then
            overall_status="degraded"
        fi
    fi
    
    # 系统资源检查
    if disk_check; then
        check_results["disk_space"]="healthy"
    else
        check_results["disk_space"]="warning"
        if [[ "$overall_status" == "healthy" ]]; then
            overall_status="degraded"
        fi
    fi
    
    if memory_check; then
        check_results["memory_usage"]="healthy"
    else
        check_results["memory_usage"]="warning"
        if [[ "$overall_status" == "healthy" ]]; then
            overall_status="degraded"
        fi
    fi
}

# 输出结果
output_results() {
    if [[ "$JSON_OUTPUT" == "true" ]]; then
        # JSON格式输出
        echo "{"
        echo "  \"timestamp\": \"$(date -Iseconds)\","
        echo "  \"overall_status\": \"$overall_status\","
        echo "  \"checks\": {"
        
        local first=true
        for check in "${!check_results[@]}"; do
            if [[ "$first" == "false" ]]; then
                echo ","
            fi
            echo -n "    \"$check\": \"${check_results[$check]}\""
            first=false
        done
        echo ""
        echo "  }"
        echo "}"
    else
        # 人类可读格式输出
        echo ""
        echo "=========================================="
        echo "           系统健康检查报告"
        echo "=========================================="
        echo "检查时间: $(date)"
        echo "总体状态: $overall_status"
        echo ""
        echo "详细检查结果:"
        echo "------------------------------------------"
        
        for check in "${!check_results[@]}"; do
            local status="${check_results[$check]}"
            local status_icon
            
            case "$status" in
                "healthy")
                    status_icon="${GREEN}✓${NC}"
                    ;;
                "degraded")
                    status_icon="${YELLOW}⚠${NC}"
                    ;;
                "warning")
                    status_icon="${YELLOW}⚠${NC}"
                    ;;
                "unhealthy")
                    status_icon="${RED}✗${NC}"
                    ;;
                *)
                    status_icon="${RED}?${NC}"
                    ;;
            esac
            
            printf "%-20s %s %s\n" "$check" "$status_icon" "$status"
        done
        
        echo "------------------------------------------"
        
        case "$overall_status" in
            "healthy")
                echo -e "${GREEN}系统运行正常${NC}"
                ;;
            "degraded")
                echo -e "${YELLOW}系统运行但存在警告${NC}"
                ;;
            "unhealthy")
                echo -e "${RED}系统存在严重问题${NC}"
                ;;
        esac
        
        echo "=========================================="
    fi
}

# 主函数
main() {
    # 检查Docker是否运行
    if ! docker info >/dev/null 2>&1; then
        if [[ "$JSON_OUTPUT" == "true" ]]; then
            echo '{"error": "Docker is not running", "overall_status": "unhealthy"}'
        else
            log_error "Docker未运行，无法执行健康检查"
        fi
        exit 1
    fi
    
    # 执行检查
    run_checks
    
    # 输出结果
    output_results
    
    # 设置退出码
    case "$overall_status" in
        "healthy")
            exit 0
            ;;
        "degraded")
            exit 1
            ;;
        "unhealthy")
            exit 2
            ;;
        *)
            exit 3
            ;;
    esac
}

# 执行主函数
main "$@"