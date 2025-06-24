#!/bin/bash

# 博客系统性能测试脚本
# 使用方法: ./performance-test.sh [--type=TYPE] [--users=NUM] [--duration=SECONDS] [--report]

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
TEST_TYPE="basic"
CONCURRENT_USERS=10
TEST_DURATION=60
GENERATE_REPORT=false
BASE_URL="http://localhost"
API_BASE_URL="http://localhost:8081"
REPORT_DIR="./reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 测试配置
RAMP_UP_TIME=10
THINK_TIME=1
TIMEOUT=30
RETRIES=3

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --type=*)
            TEST_TYPE="${1#*=}"
            shift
            ;;
        --users=*)
            CONCURRENT_USERS="${1#*=}"
            shift
            ;;
        --duration=*)
            TEST_DURATION="${1#*=}"
            shift
            ;;
        --base-url=*)
            BASE_URL="${1#*=}"
            shift
            ;;
        --api-url=*)
            API_BASE_URL="${1#*=}"
            shift
            ;;
        --report|-r)
            GENERATE_REPORT=true
            shift
            ;;
        --ramp-up=*)
            RAMP_UP_TIME="${1#*=}"
            shift
            ;;
        --timeout=*)
            TIMEOUT="${1#*=}"
            shift
            ;;
        --help|-h)
            echo "使用方法: $0 [选项]"
            echo "选项:"
            echo "  --type=TYPE        测试类型 (basic|load|stress|spike，默认: basic)"
            echo "  --users=NUM        并发用户数 (默认: 10)"
            echo "  --duration=SECONDS 测试持续时间 (默认: 60)"
            echo "  --base-url=URL     前端基础URL (默认: http://localhost)"
            echo "  --api-url=URL      API基础URL (默认: http://localhost:8081)"
            echo "  --report, -r       生成详细报告"
            echo "  --ramp-up=SECONDS  用户启动时间 (默认: 10)"
            echo "  --timeout=SECONDS  请求超时时间 (默认: 30)"
            echo "  --help, -h         显示帮助"
            echo ""
            echo "测试类型说明:"
            echo "  basic  - 基础功能测试 (少量用户)"
            echo "  load   - 负载测试 (正常负载)"
            echo "  stress - 压力测试 (高负载)"
            echo "  spike  - 峰值测试 (突发负载)"
            echo ""
            echo "测试场景:"
            echo "  - 首页访问"
            echo "  - 文章列表"
            echo "  - 文章详情"
            echo "  - 分类浏览"
            echo "  - 搜索功能"
            echo "  - API接口"
            exit 0
            ;;
        *)
            echo "未知选项: $1"
            exit 1
            ;;
    esac
done

# 创建报告目录
mkdir -p "$REPORT_DIR"

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

log_test() {
    echo -e "${MAGENTA}[TEST]${NC} $1"
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖工具..."
    
    local missing_tools=()
    
    # 检查curl
    if ! command -v curl &> /dev/null; then
        missing_tools+=("curl")
    fi
    
    # 检查ab (Apache Bench)
    if ! command -v ab &> /dev/null; then
        missing_tools+=("ab (Apache Bench)")
    fi
    
    # 检查jq
    if ! command -v jq &> /dev/null; then
        log_warning "jq未安装，JSON解析功能将受限"
    fi
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "缺少必要工具: ${missing_tools[*]}"
        log_info "请安装缺少的工具:"
        for tool in "${missing_tools[@]}"; do
            case "$tool" in
                "curl")
                    echo "  brew install curl"
                    ;;
                "ab (Apache Bench)")
                    echo "  brew install httpd"
                    ;;
            esac
        done
        exit 1
    fi
    
    log_success "依赖检查完成"
}

# 检查服务可用性
check_service_availability() {
    log_info "检查服务可用性..."
    
    # 检查前端服务
    local frontend_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$BASE_URL" || echo "000")
    if [[ "$frontend_status" != "200" ]]; then
        log_error "前端服务不可用: $BASE_URL (HTTP $frontend_status)"
        exit 1
    fi
    
    # 检查API服务
    local api_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$API_BASE_URL/actuator/health" || echo "000")
    if [[ "$api_status" != "200" ]]; then
        log_error "API服务不可用: $API_BASE_URL (HTTP $api_status)"
        exit 1
    fi
    
    log_success "服务可用性检查完成"
}

# 基础功能测试
basic_functionality_test() {
    log_test "执行基础功能测试..."
    
    local test_results=()
    local total_tests=0
    local passed_tests=0
    
    # 测试首页
    log_info "测试首页访问..."
    ((total_tests++))
    local start_time=$(date +%s%3N)
    local response=$(curl -s -w "HTTPSTATUS:%{http_code};TIME:%{time_total}" --max-time $TIMEOUT "$BASE_URL")
    local end_time=$(date +%s%3N)
    local http_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    local response_time=$(echo "$response" | grep -o "TIME:[0-9.]*" | cut -d: -f2)
    
    if [[ "$http_code" == "200" ]]; then
        ((passed_tests++))
        test_results+=("首页访问: PASS (${response_time}s)")
        log_success "首页访问测试通过"
    else
        test_results+=("首页访问: FAIL (HTTP $http_code)")
        log_error "首页访问测试失败"
    fi
    
    # 测试API健康检查
    log_info "测试API健康检查..."
    ((total_tests++))
    local health_response=$(curl -s -w "HTTPSTATUS:%{http_code};TIME:%{time_total}" --max-time $TIMEOUT "$API_BASE_URL/actuator/health")
    local health_code=$(echo "$health_response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    local health_time=$(echo "$health_response" | grep -o "TIME:[0-9.]*" | cut -d: -f2)
    
    if [[ "$health_code" == "200" ]]; then
        ((passed_tests++))
        test_results+=("API健康检查: PASS (${health_time}s)")
        log_success "API健康检查测试通过"
    else
        test_results+=("API健康检查: FAIL (HTTP $health_code)")
        log_error "API健康检查测试失败"
    fi
    
    # 测试文章列表API
    log_info "测试文章列表API..."
    ((total_tests++))
    local articles_response=$(curl -s -w "HTTPSTATUS:%{http_code};TIME:%{time_total}" --max-time $TIMEOUT "$API_BASE_URL/api/articles")
    local articles_code=$(echo "$articles_response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    local articles_time=$(echo "$articles_response" | grep -o "TIME:[0-9.]*" | cut -d: -f2)
    
    if [[ "$articles_code" == "200" ]]; then
        ((passed_tests++))
        test_results+=("文章列表API: PASS (${articles_time}s)")
        log_success "文章列表API测试通过"
    else
        test_results+=("文章列表API: FAIL (HTTP $articles_code)")
        log_error "文章列表API测试失败"
    fi
    
    # 测试分类列表API
    log_info "测试分类列表API..."
    ((total_tests++))
    local categories_response=$(curl -s -w "HTTPSTATUS:%{http_code};TIME:%{time_total}" --max-time $TIMEOUT "$API_BASE_URL/api/categories")
    local categories_code=$(echo "$categories_response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    local categories_time=$(echo "$categories_response" | grep -o "TIME:[0-9.]*" | cut -d: -f2)
    
    if [[ "$categories_code" == "200" ]]; then
        ((passed_tests++))
        test_results+=("分类列表API: PASS (${categories_time}s)")
        log_success "分类列表API测试通过"
    else
        test_results+=("分类列表API: FAIL (HTTP $categories_code)")
        log_error "分类列表API测试失败"
    fi
    
    # 输出测试结果
    echo ""
    log_info "基础功能测试结果:"
    for result in "${test_results[@]}"; do
        echo "  $result"
    done
    echo "  总计: $passed_tests/$total_tests 通过"
    
    return $((total_tests - passed_tests))
}

# 负载测试
load_test() {
    local test_name="$1"
    local url="$2"
    local users="$3"
    local duration="$4"
    
    log_test "执行负载测试: $test_name"
    log_info "URL: $url"
    log_info "并发用户: $users"
    log_info "持续时间: ${duration}秒"
    
    local total_requests=$((users * duration))
    local output_file="$REPORT_DIR/load_test_${test_name}_${TIMESTAMP}.txt"
    
    # 使用Apache Bench进行负载测试
    if ab -n "$total_requests" -c "$users" -t "$duration" -g "${output_file}.gnuplot" "$url" > "$output_file" 2>&1; then
        # 解析结果
        local requests_per_second=$(grep "Requests per second" "$output_file" | awk '{print $4}')
        local time_per_request=$(grep "Time per request" "$output_file" | head -1 | awk '{print $4}')
        local failed_requests=$(grep "Failed requests" "$output_file" | awk '{print $3}')
        local transfer_rate=$(grep "Transfer rate" "$output_file" | awk '{print $3}')
        
        log_success "负载测试完成: $test_name"
        echo "  请求/秒: $requests_per_second"
        echo "  平均响应时间: ${time_per_request}ms"
        echo "  失败请求: $failed_requests"
        echo "  传输速率: ${transfer_rate} KB/sec"
        
        return 0
    else
        log_error "负载测试失败: $test_name"
        return 1
    fi
}

# 压力测试
stress_test() {
    log_test "执行压力测试..."
    
    local stress_users=$((CONCURRENT_USERS * 2))
    local stress_duration=$((TEST_DURATION / 2))
    
    log_info "压力测试配置:"
    echo "  并发用户: $stress_users (正常负载的2倍)"
    echo "  持续时间: ${stress_duration}秒"
    
    # 测试多个端点
    local endpoints=(
        "$BASE_URL:首页"
        "$API_BASE_URL/api/articles:文章列表"
        "$API_BASE_URL/api/categories:分类列表"
        "$API_BASE_URL/actuator/health:健康检查"
    )
    
    local failed_tests=0
    
    for endpoint in "${endpoints[@]}"; do
        IFS=':' read -r url name <<< "$endpoint"
        
        if ! load_test "stress_${name// /_}" "$url" "$stress_users" "$stress_duration"; then
            ((failed_tests++))
        fi
        
        # 测试间隔
        sleep 5
    done
    
    return $failed_tests
}

# 峰值测试
spike_test() {
    log_test "执行峰值测试..."
    
    local spike_users=$((CONCURRENT_USERS * 5))
    local spike_duration=30
    
    log_info "峰值测试配置:"
    echo "  并发用户: $spike_users (正常负载的5倍)"
    echo "  持续时间: ${spike_duration}秒"
    
    # 突发负载测试
    if load_test "spike_homepage" "$BASE_URL" "$spike_users" "$spike_duration"; then
        log_success "峰值测试完成"
        return 0
    else
        log_error "峰值测试失败"
        return 1
    fi
}

# 生成性能报告
generate_performance_report() {
    log_info "生成性能测试报告..."
    
    local report_file="$REPORT_DIR/performance_report_${TIMESTAMP}.html"
    
    cat > "$report_file" << EOF
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>博客系统性能测试报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #f4f4f4; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .error { color: #dc3545; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .chart { width: 100%; height: 300px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>博客系统性能测试报告</h1>
        <p><strong>测试时间:</strong> $(date)</p>
        <p><strong>测试类型:</strong> $TEST_TYPE</p>
        <p><strong>并发用户:</strong> $CONCURRENT_USERS</p>
        <p><strong>测试持续时间:</strong> ${TEST_DURATION}秒</p>
        <p><strong>基础URL:</strong> $BASE_URL</p>
        <p><strong>API URL:</strong> $API_BASE_URL</p>
    </div>
    
    <div class="section">
        <h2>测试环境</h2>
        <table>
            <tr><th>项目</th><th>值</th></tr>
            <tr><td>操作系统</td><td>$(uname -s)</td></tr>
            <tr><td>系统版本</td><td>$(uname -r)</td></tr>
            <tr><td>CPU信息</td><td>$(sysctl -n machdep.cpu.brand_string 2>/dev/null || echo "未知")</td></tr>
            <tr><td>内存信息</td><td>$(system_profiler SPHardwareDataType | grep "Memory:" | awk '{print $2, $3}' || echo "未知")</td></tr>
        </table>
    </div>
    
    <div class="section">
        <h2>测试结果摘要</h2>
        <p>详细的测试结果请查看以下文件:</p>
        <ul>
EOF
    
    # 添加测试文件链接
    for file in "$REPORT_DIR"/load_test_*_"$TIMESTAMP".txt; do
        if [[ -f "$file" ]]; then
            echo "            <li><a href=\"$(basename "$file")\">$(basename "$file")</a></li>" >> "$report_file"
        fi
    done
    
    cat >> "$report_file" << EOF
        </ul>
    </div>
    
    <div class="section">
        <h2>性能指标</h2>
        <p>以下是主要性能指标的汇总:</p>
        <!-- 这里可以添加图表和详细指标 -->
    </div>
    
    <div class="section">
        <h2>建议和优化</h2>
        <ul>
            <li>监控响应时间，确保在可接受范围内</li>
            <li>检查错误率，确保系统稳定性</li>
            <li>根据负载测试结果调整服务器配置</li>
            <li>优化数据库查询和缓存策略</li>
            <li>考虑使用CDN加速静态资源</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>测试日志</h2>
        <pre>
EOF
    
    # 添加测试日志
    if [[ -f "$REPORT_DIR/test_log_${TIMESTAMP}.txt" ]]; then
        cat "$REPORT_DIR/test_log_${TIMESTAMP}.txt" >> "$report_file"
    fi
    
    cat >> "$report_file" << EOF
        </pre>
    </div>
</body>
</html>
EOF
    
    log_success "性能测试报告已生成: $report_file"
}

# 主测试函数
perform_tests() {
    local test_log="$REPORT_DIR/test_log_${TIMESTAMP}.txt"
    
    # 重定向输出到日志文件
    if [[ "$GENERATE_REPORT" == "true" ]]; then
        exec 1> >(tee -a "$test_log")
        exec 2> >(tee -a "$test_log" >&2)
    fi
    
    log_info "开始性能测试..."
    log_info "测试类型: $TEST_TYPE"
    
    local failed_tests=0
    
    case "$TEST_TYPE" in
        "basic")
            if ! basic_functionality_test; then
                ((failed_tests++))
            fi
            
            # 基础负载测试
            if ! load_test "basic_homepage" "$BASE_URL" "$CONCURRENT_USERS" "$TEST_DURATION"; then
                ((failed_tests++))
            fi
            ;;
        "load")
            # 负载测试
            local endpoints=(
                "$BASE_URL:首页"
                "$API_BASE_URL/api/articles:文章列表"
                "$API_BASE_URL/api/categories:分类列表"
            )
            
            for endpoint in "${endpoints[@]}"; do
                IFS=':' read -r url name <<< "$endpoint"
                
                if ! load_test "load_${name// /_}" "$url" "$CONCURRENT_USERS" "$TEST_DURATION"; then
                    ((failed_tests++))
                fi
                
                sleep 2
            done
            ;;
        "stress")
            if ! stress_test; then
                ((failed_tests++))
            fi
            ;;
        "spike")
            if ! spike_test; then
                ((failed_tests++))
            fi
            ;;
        *)
            log_error "未知的测试类型: $TEST_TYPE"
            exit 1
            ;;
    esac
    
    # 生成报告
    if [[ "$GENERATE_REPORT" == "true" ]]; then
        generate_performance_report
    fi
    
    if [[ $failed_tests -eq 0 ]]; then
        log_success "所有性能测试完成"
        return 0
    else
        log_warning "$failed_tests 个测试失败"
        return 1
    fi
}

# 主函数
main() {
    echo "博客系统性能测试脚本"
    echo "==========================================="
    echo "测试类型: $TEST_TYPE"
    echo "并发用户: $CONCURRENT_USERS"
    echo "测试持续时间: ${TEST_DURATION}秒"
    echo "基础URL: $BASE_URL"
    echo "API URL: $API_BASE_URL"
    echo "生成报告: $GENERATE_REPORT"
    echo ""
    
    # 检查依赖
    check_dependencies
    
    # 检查服务可用性
    check_service_availability
    
    # 执行测试
    if perform_tests; then
        log_success "性能测试全部完成"
        
        if [[ "$GENERATE_REPORT" == "true" ]]; then
            log_info "测试报告保存在: $REPORT_DIR"
        fi
        
        exit 0
    else
        log_error "部分性能测试失败"
        exit 1
    fi
}

# 执行主函数
main "$@"