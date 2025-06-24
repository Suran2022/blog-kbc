#!/bin/bash

# 博客系统监控脚本
# 使用方法: ./monitor.sh [--interval=SECONDS] [--output=console|file|json] [--alert]

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
INTERVAL=30
OUTPUT_MODE="console"
ALERT_MODE=false
LOG_FILE="./logs/monitor.log"
ALERT_LOG="./logs/alert.log"

# 阈值配置
CPU_THRESHOLD=80
MEMORY_THRESHOLD=85
DISK_THRESHOLD=90
RESPONSE_TIME_THRESHOLD=5000  # 毫秒
ERROR_RATE_THRESHOLD=5        # 百分比

# 容器配置
MYSQL_CONTAINER="blog-mysql-prod"
REDIS_CONTAINER="blog-redis-prod"
BACKEND_CONTAINER="blog-backend-prod"
FRONTEND_CONTAINER="blog-frontend-prod"
NGINX_CONTAINER="blog-nginx-prod"

# API配置
BACKEND_URL="http://localhost:8081"
FRONTEND_URL="http://localhost:80"
HEALTH_CHECK_URL="$BACKEND_URL/actuator/health"

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --interval=*)
            INTERVAL="${1#*=}"
            shift
            ;;
        --output=*)
            OUTPUT_MODE="${1#*=}"
            shift
            ;;
        --alert|-a)
            ALERT_MODE=true
            shift
            ;;
        --cpu-threshold=*)
            CPU_THRESHOLD="${1#*=}"
            shift
            ;;
        --memory-threshold=*)
            MEMORY_THRESHOLD="${1#*=}"
            shift
            ;;
        --disk-threshold=*)
            DISK_THRESHOLD="${1#*=}"
            shift
            ;;
        --help|-h)
            echo "使用方法: $0 [选项]"
            echo "选项:"
            echo "  --interval=SECONDS     监控间隔 (默认: 30)"
            echo "  --output=MODE          输出模式 (console|file|json，默认: console)"
            echo "  --alert, -a            启用告警模式"
            echo "  --cpu-threshold=NUM    CPU使用率告警阈值 (默认: 80)"
            echo "  --memory-threshold=NUM 内存使用率告警阈值 (默认: 85)"
            echo "  --disk-threshold=NUM   磁盘使用率告警阈值 (默认: 90)"
            echo "  --help, -h             显示帮助"
            echo ""
            echo "输出模式说明:"
            echo "  console - 控制台输出 (彩色)"
            echo "  file    - 文件输出"
            echo "  json    - JSON格式输出"
            echo ""
            echo "监控指标:"
            echo "  - 容器状态和资源使用"
            echo "  - 系统资源 (CPU、内存、磁盘)"
            echo "  - 网络连接和响应时间"
            echo "  - 数据库连接和性能"
            echo "  - 应用健康状态"
            exit 0
            ;;
        *)
            echo "未知选项: $1"
            exit 1
            ;;
    esac
done

# 创建日志目录
mkdir -p "$(dirname "$LOG_FILE")"
mkdir -p "$(dirname "$ALERT_LOG")"

# 日志函数
log_info() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$OUTPUT_MODE" in
        "console")
            echo -e "${BLUE}[INFO]${NC} $message"
            ;;
        "file")
            echo "[$timestamp] [INFO] $message" >> "$LOG_FILE"
            ;;
        "json")
            echo "{\"timestamp\":\"$timestamp\",\"level\":\"INFO\",\"message\":\"$message\"}"
            ;;
    esac
}

log_success() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$OUTPUT_MODE" in
        "console")
            echo -e "${GREEN}[SUCCESS]${NC} $message"
            ;;
        "file")
            echo "[$timestamp] [SUCCESS] $message" >> "$LOG_FILE"
            ;;
        "json")
            echo "{\"timestamp\":\"$timestamp\",\"level\":\"SUCCESS\",\"message\":\"$message\"}"
            ;;
    esac
}

log_warning() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$OUTPUT_MODE" in
        "console")
            echo -e "${YELLOW}[WARNING]${NC} $message"
            ;;
        "file")
            echo "[$timestamp] [WARNING] $message" >> "$LOG_FILE"
            echo "[$timestamp] [WARNING] $message" >> "$ALERT_LOG"
            ;;
        "json")
            echo "{\"timestamp\":\"$timestamp\",\"level\":\"WARNING\",\"message\":\"$message\"}"
            ;;
    esac
}

log_error() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$OUTPUT_MODE" in
        "console")
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        "file")
            echo "[$timestamp] [ERROR] $message" >> "$LOG_FILE"
            echo "[$timestamp] [ERROR] $message" >> "$ALERT_LOG"
            ;;
        "json")
            echo "{\"timestamp\":\"$timestamp\",\"level\":\"ERROR\",\"message\":\"$message\"}"
            ;;
    esac
}

# 获取容器状态
get_container_status() {
    local container="$1"
    
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "$container"; then
        local status=$(docker ps --format "{{.Status}}" --filter "name=$container")
        echo "running:$status"
    elif docker ps -a --format "table {{.Names}}\t{{.Status}}" | grep -q "$container"; then
        local status=$(docker ps -a --format "{{.Status}}" --filter "name=$container")
        echo "stopped:$status"
    else
        echo "not_found:Container not found"
    fi
}

# 获取容器资源使用
get_container_stats() {
    local container="$1"
    
    if docker ps --format "{{.Names}}" | grep -q "$container"; then
        docker stats --no-stream --format "table {{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}" "$container" 2>/dev/null || echo "N/A\tN/A\tN/A\tN/A\tN/A"
    else
        echo "N/A\tN/A\tN/A\tN/A\tN/A"
    fi
}

# 获取系统资源使用
get_system_stats() {
    # CPU使用率
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//' || echo "0")
    
    # 内存使用率
    local memory_info=$(vm_stat | grep -E "Pages (free|active|inactive|speculative|wired down)")
    local page_size=4096
    local free_pages=$(echo "$memory_info" | grep "Pages free" | awk '{print $3}' | sed 's/\.//')
    local active_pages=$(echo "$memory_info" | grep "Pages active" | awk '{print $3}' | sed 's/\.//')
    local inactive_pages=$(echo "$memory_info" | grep "Pages inactive" | awk '{print $3}' | sed 's/\.//')
    local speculative_pages=$(echo "$memory_info" | grep "Pages speculative" | awk '{print $3}' | sed 's/\.//')
    local wired_pages=$(echo "$memory_info" | grep "Pages wired down" | awk '{print $4}' | sed 's/\.//')
    
    local total_pages=$((free_pages + active_pages + inactive_pages + speculative_pages + wired_pages))
    local used_pages=$((active_pages + inactive_pages + wired_pages))
    local memory_usage=$((used_pages * 100 / total_pages))
    
    # 磁盘使用率
    local disk_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
    
    # 负载平均值
    local load_avg=$(uptime | awk -F'load averages:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    
    echo "$cpu_usage:$memory_usage:$disk_usage:$load_avg"
}

# 检查网络连接
check_network_connectivity() {
    local url="$1"
    local timeout=5
    
    local start_time=$(date +%s%3N)
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time $timeout "$url" 2>/dev/null || echo "000")
    local end_time=$(date +%s%3N)
    local response_time=$((end_time - start_time))
    
    echo "$http_code:$response_time"
}

# 检查数据库连接
check_database_connection() {
    local container="$1"
    
    if docker ps --format "{{.Names}}" | grep -q "$container"; then
        if [[ "$container" == *"mysql"* ]]; then
            # MySQL连接检查
            local result=$(docker exec "$container" mysqladmin ping -u root -p"${MYSQL_ROOT_PASSWORD:-root123456}" 2>/dev/null || echo "failed")
            if echo "$result" | grep -q "mysqld is alive"; then
                echo "connected"
            else
                echo "failed"
            fi
        elif [[ "$container" == *"redis"* ]]; then
            # Redis连接检查
            local result=$(docker exec "$container" redis-cli ping 2>/dev/null || echo "failed")
            if echo "$result" | grep -q "PONG"; then
                echo "connected"
            else
                echo "failed"
            fi
        fi
    else
        echo "container_not_running"
    fi
}

# 获取应用健康状态
get_application_health() {
    local health_response=$(curl -s --max-time 5 "$HEALTH_CHECK_URL" 2>/dev/null || echo '{"status":"DOWN"}')
    local status=$(echo "$health_response" | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "UNKNOWN")
    echo "$status"
}

# 检查告警条件
check_alerts() {
    local cpu_usage="$1"
    local memory_usage="$2"
    local disk_usage="$3"
    local response_time="$4"
    local mysql_status="$5"
    local redis_status="$6"
    local app_health="$7"
    
    local alerts=()
    
    # CPU告警
    if [[ "$cpu_usage" != "N/A" ]] && (( $(echo "$cpu_usage > $CPU_THRESHOLD" | bc -l) )); then
        alerts+=("CPU使用率过高: ${cpu_usage}% (阈值: ${CPU_THRESHOLD}%)")
    fi
    
    # 内存告警
    if [[ "$memory_usage" != "N/A" ]] && [[ $memory_usage -gt $MEMORY_THRESHOLD ]]; then
        alerts+=("内存使用率过高: ${memory_usage}% (阈值: ${MEMORY_THRESHOLD}%)")
    fi
    
    # 磁盘告警
    if [[ "$disk_usage" != "N/A" ]] && [[ $disk_usage -gt $DISK_THRESHOLD ]]; then
        alerts+=("磁盘使用率过高: ${disk_usage}% (阈值: ${DISK_THRESHOLD}%)")
    fi
    
    # 响应时间告警
    if [[ "$response_time" != "N/A" ]] && [[ $response_time -gt $RESPONSE_TIME_THRESHOLD ]]; then
        alerts+=("响应时间过长: ${response_time}ms (阈值: ${RESPONSE_TIME_THRESHOLD}ms)")
    fi
    
    # 数据库连接告警
    if [[ "$mysql_status" != "connected" ]]; then
        alerts+=("MySQL连接失败: $mysql_status")
    fi
    
    if [[ "$redis_status" != "connected" ]]; then
        alerts+=("Redis连接失败: $redis_status")
    fi
    
    # 应用健康告警
    if [[ "$app_health" != "UP" ]]; then
        alerts+=("应用健康检查失败: $app_health")
    fi
    
    # 输出告警
    for alert in "${alerts[@]}"; do
        log_error "ALERT: $alert"
    done
    
    return ${#alerts[@]}
}

# 格式化输出
format_output() {
    local timestamp="$1"
    local system_stats="$2"
    local mysql_status="$3"
    local redis_status="$4"
    local backend_stats="$5"
    local frontend_stats="$6"
    local nginx_stats="$7"
    local network_check="$8"
    local app_health="$9"
    
    # 解析系统统计
    IFS=':' read -r cpu_usage memory_usage disk_usage load_avg <<< "$system_stats"
    
    # 解析网络检查
    IFS=':' read -r http_code response_time <<< "$network_check"
    
    case "$OUTPUT_MODE" in
        "console")
            echo -e "\n${CYAN}==================== 博客系统监控报告 ====================${NC}"
            echo -e "${BLUE}时间:${NC} $timestamp"
            echo ""
            
            echo -e "${MAGENTA}系统资源:${NC}"
            echo -e "  CPU使用率: ${cpu_usage}%"
            echo -e "  内存使用率: ${memory_usage}%"
            echo -e "  磁盘使用率: ${disk_usage}%"
            echo -e "  负载平均值: ${load_avg}"
            echo ""
            
            echo -e "${MAGENTA}容器状态:${NC}"
            echo -e "  MySQL: $(get_container_status "$MYSQL_CONTAINER" | cut -d':' -f1)"
            echo -e "  Redis: $(get_container_status "$REDIS_CONTAINER" | cut -d':' -f1)"
            echo -e "  Backend: $(get_container_status "$BACKEND_CONTAINER" | cut -d':' -f1)"
            echo -e "  Frontend: $(get_container_status "$FRONTEND_CONTAINER" | cut -d':' -f1)"
            echo ""
            
            echo -e "${MAGENTA}数据库连接:${NC}"
            echo -e "  MySQL: $mysql_status"
            echo -e "  Redis: $redis_status"
            echo ""
            
            echo -e "${MAGENTA}网络状态:${NC}"
            echo -e "  HTTP状态码: $http_code"
            echo -e "  响应时间: ${response_time}ms"
            echo ""
            
            echo -e "${MAGENTA}应用健康:${NC}"
            echo -e "  状态: $app_health"
            echo ""
            ;;
        "file")
            {
                echo "==================== 博客系统监控报告 ===================="
                echo "时间: $timestamp"
                echo ""
                echo "系统资源:"
                echo "  CPU使用率: ${cpu_usage}%"
                echo "  内存使用率: ${memory_usage}%"
                echo "  磁盘使用率: ${disk_usage}%"
                echo "  负载平均值: ${load_avg}"
                echo ""
                echo "容器状态:"
                echo "  MySQL: $(get_container_status "$MYSQL_CONTAINER" | cut -d':' -f1)"
                echo "  Redis: $(get_container_status "$REDIS_CONTAINER" | cut -d':' -f1)"
                echo "  Backend: $(get_container_status "$BACKEND_CONTAINER" | cut -d':' -f1)"
                echo "  Frontend: $(get_container_status "$FRONTEND_CONTAINER" | cut -d':' -f1)"
                echo ""
                echo "数据库连接:"
                echo "  MySQL: $mysql_status"
                echo "  Redis: $redis_status"
                echo ""
                echo "网络状态:"
                echo "  HTTP状态码: $http_code"
                echo "  响应时间: ${response_time}ms"
                echo ""
                echo "应用健康:"
                echo "  状态: $app_health"
                echo ""
            } >> "$LOG_FILE"
            ;;
        "json")
            cat << EOF
{
  "timestamp": "$timestamp",
  "system": {
    "cpu_usage": "$cpu_usage",
    "memory_usage": "$memory_usage",
    "disk_usage": "$disk_usage",
    "load_average": "$load_avg"
  },
  "containers": {
    "mysql": "$(get_container_status "$MYSQL_CONTAINER" | cut -d':' -f1)",
    "redis": "$(get_container_status "$REDIS_CONTAINER" | cut -d':' -f1)",
    "backend": "$(get_container_status "$BACKEND_CONTAINER" | cut -d':' -f1)",
    "frontend": "$(get_container_status "$FRONTEND_CONTAINER" | cut -d':' -f1)"
  },
  "database": {
    "mysql_status": "$mysql_status",
    "redis_status": "$redis_status"
  },
  "network": {
    "http_code": "$http_code",
    "response_time_ms": "$response_time"
  },
  "application": {
    "health_status": "$app_health"
  }
}
EOF
            ;;
    esac
}

# 单次监控检查
perform_check() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # 获取系统统计
    local system_stats=$(get_system_stats)
    
    # 检查数据库连接
    local mysql_status=$(check_database_connection "$MYSQL_CONTAINER")
    local redis_status=$(check_database_connection "$REDIS_CONTAINER")
    
    # 获取容器统计
    local backend_stats=$(get_container_stats "$BACKEND_CONTAINER")
    local frontend_stats=$(get_container_stats "$FRONTEND_CONTAINER")
    local nginx_stats=$(get_container_stats "$NGINX_CONTAINER")
    
    # 检查网络连接
    local network_check=$(check_network_connectivity "$HEALTH_CHECK_URL")
    
    # 获取应用健康状态
    local app_health=$(get_application_health)
    
    # 格式化输出
    format_output "$timestamp" "$system_stats" "$mysql_status" "$redis_status" \
                  "$backend_stats" "$frontend_stats" "$nginx_stats" "$network_check" "$app_health"
    
    # 检查告警
    if [[ "$ALERT_MODE" == "true" ]]; then
        IFS=':' read -r cpu_usage memory_usage disk_usage load_avg <<< "$system_stats"
        IFS=':' read -r http_code response_time <<< "$network_check"
        
        check_alerts "$cpu_usage" "$memory_usage" "$disk_usage" "$response_time" \
                     "$mysql_status" "$redis_status" "$app_health"
    fi
}

# 信号处理
cleanup() {
    log_info "监控脚本停止"
    exit 0
}

trap cleanup SIGINT SIGTERM

# 主函数
main() {
    log_info "博客系统监控脚本启动"
    log_info "监控间隔: ${INTERVAL}秒"
    log_info "输出模式: $OUTPUT_MODE"
    log_info "告警模式: $ALERT_MODE"
    
    if [[ "$OUTPUT_MODE" == "file" ]]; then
        log_info "日志文件: $LOG_FILE"
    fi
    
    if [[ "$ALERT_MODE" == "true" ]]; then
        log_info "告警日志: $ALERT_LOG"
        log_info "告警阈值: CPU=${CPU_THRESHOLD}%, 内存=${MEMORY_THRESHOLD}%, 磁盘=${DISK_THRESHOLD}%"
    fi
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装"
        exit 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker未运行"
        exit 1
    fi
    
    # 监控循环
    while true; do
        perform_check
        
        if [[ "$OUTPUT_MODE" == "console" ]]; then
            echo -e "${BLUE}下次检查将在 ${INTERVAL} 秒后进行...${NC}"
        fi
        
        sleep "$INTERVAL"
    done
}

# 执行主函数
main "$@"