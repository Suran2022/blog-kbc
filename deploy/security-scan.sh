#!/bin/bash

# 博客系统安全扫描脚本
# 使用方法: ./security-scan.sh [--type=TYPE] [--target=URL] [--report] [--fix]

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
SCAN_TYPE="all"
TARGET_URL="http://localhost"
API_URL="http://localhost:8081"
GENERATE_REPORT=false
AUTO_FIX=false
REPORT_DIR="./security-reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 安全检查配置
SSL_CHECK=true
HEADER_CHECK=true
VULN_CHECK=true
CONFIG_CHECK=true
DEPENDENCY_CHECK=true

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --type=*)
            SCAN_TYPE="${1#*=}"
            shift
            ;;
        --target=*)
            TARGET_URL="${1#*=}"
            shift
            ;;
        --api-url=*)
            API_URL="${1#*=}"
            shift
            ;;
        --report|-r)
            GENERATE_REPORT=true
            shift
            ;;
        --fix|-f)
            AUTO_FIX=true
            shift
            ;;
        --help|-h)
            echo "使用方法: $0 [选项]"
            echo "选项:"
            echo "  --type=TYPE        扫描类型 (all|ssl|headers|vulns|config|deps，默认: all)"
            echo "  --target=URL       目标URL (默认: http://localhost)"
            echo "  --api-url=URL      API URL (默认: http://localhost:8081)"
            echo "  --report, -r       生成安全报告"
            echo "  --fix, -f          自动修复可修复的安全问题"
            echo "  --help, -h         显示帮助"
            echo ""
            echo "扫描类型说明:"
            echo "  all     - 全面安全扫描"
            echo "  ssl     - SSL/TLS配置检查"
            echo "  headers - HTTP安全头检查"
            echo "  vulns   - 漏洞扫描"
            echo "  config  - 配置安全检查"
            echo "  deps    - 依赖安全检查"
            echo ""
            echo "安全检查项目:"
            echo "  - SSL/TLS配置和证书"
            echo "  - HTTP安全头设置"
            echo "  - 常见Web漏洞"
            echo "  - 配置文件安全"
            echo "  - 依赖包漏洞"
            echo "  - 容器安全配置"
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
    echo -e "${GREEN}[PASS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

log_critical() {
    echo -e "${RED}[CRITICAL]${NC} $1"
}

log_scan() {
    echo -e "${MAGENTA}[SCAN]${NC} $1"
}

# 检查依赖工具
check_dependencies() {
    log_info "检查安全扫描工具..."
    
    local missing_tools=()
    
    # 检查基础工具
    if ! command -v curl &> /dev/null; then
        missing_tools+=("curl")
    fi
    
    if ! command -v openssl &> /dev/null; then
        missing_tools+=("openssl")
    fi
    
    if ! command -v nmap &> /dev/null; then
        log_warning "nmap未安装，端口扫描功能将受限"
    fi
    
    if ! command -v docker &> /dev/null; then
        log_warning "docker未安装，容器安全检查将跳过"
    fi
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "缺少必要工具: ${missing_tools[*]}"
        log_info "请安装缺少的工具:"
        for tool in "${missing_tools[@]}"; do
            echo "  brew install $tool"
        done
        exit 1
    fi
    
    log_success "依赖检查完成"
}

# SSL/TLS安全检查
ssl_security_check() {
    log_scan "执行SSL/TLS安全检查..."
    
    local ssl_issues=()
    local ssl_score=0
    local max_score=100
    
    # 提取域名和端口
    local domain=$(echo "$TARGET_URL" | sed -E 's|https?://([^:/]+).*|\1|')
    local port=443
    
    if [[ "$TARGET_URL" == http://* ]]; then
        log_warning "目标使用HTTP协议，建议使用HTTPS"
        ssl_issues+=("使用HTTP协议而非HTTPS")
        ((ssl_score -= 30))
        port=80
    fi
    
    # 检查SSL证书（仅HTTPS）
    if [[ "$TARGET_URL" == https://* ]]; then
        log_info "检查SSL证书..."
        
        # 检查证书有效性
        if openssl s_client -connect "$domain:$port" -servername "$domain" </dev/null 2>/dev/null | openssl x509 -noout -dates 2>/dev/null; then
            log_success "SSL证书有效"
            ((ssl_score += 20))
        else
            log_error "SSL证书无效或无法验证"
            ssl_issues+=("SSL证书无效")
            ((ssl_score -= 20))
        fi
        
        # 检查证书过期时间
        local cert_info=$(openssl s_client -connect "$domain:$port" -servername "$domain" </dev/null 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
        if [[ -n "$cert_info" ]]; then
            local not_after=$(echo "$cert_info" | grep "notAfter" | cut -d= -f2)
            local expiry_date=$(date -j -f "%b %d %H:%M:%S %Y %Z" "$not_after" "+%s" 2>/dev/null || echo "0")
            local current_date=$(date +%s)
            local days_until_expiry=$(( (expiry_date - current_date) / 86400 ))
            
            if [[ $days_until_expiry -lt 30 ]]; then
                log_critical "SSL证书将在${days_until_expiry}天内过期"
                ssl_issues+=("SSL证书即将过期")
                ((ssl_score -= 15))
            elif [[ $days_until_expiry -lt 90 ]]; then
                log_warning "SSL证书将在${days_until_expiry}天内过期"
                ssl_issues+=("SSL证书即将过期")
                ((ssl_score -= 5))
            else
                log_success "SSL证书有效期充足 (${days_until_expiry}天)"
                ((ssl_score += 10))
            fi
        fi
        
        # 检查SSL协议版本
        log_info "检查SSL协议版本..."
        local ssl_protocols=("ssl2" "ssl3" "tls1" "tls1_1")
        local weak_protocols=()
        
        for protocol in "${ssl_protocols[@]}"; do
            if openssl s_client -connect "$domain:$port" -"$protocol" </dev/null 2>/dev/null | grep -q "Cipher is"; then
                weak_protocols+=("$protocol")
            fi
        done
        
        if [[ ${#weak_protocols[@]} -gt 0 ]]; then
            log_error "检测到弱SSL协议: ${weak_protocols[*]}"
            ssl_issues+=("支持弱SSL协议: ${weak_protocols[*]}")
            ((ssl_score -= 20))
        else
            log_success "未检测到弱SSL协议"
            ((ssl_score += 15))
        fi
        
        # 检查加密套件
        log_info "检查加密套件..."
        local cipher_info=$(openssl s_client -connect "$domain:$port" -cipher 'ALL:!aNULL:!eNULL' </dev/null 2>/dev/null | grep "Cipher is")
        if echo "$cipher_info" | grep -qE "(RC4|DES|MD5|NULL)"; then
            log_error "检测到弱加密套件"
            ssl_issues+=("使用弱加密套件")
            ((ssl_score -= 15))
        else
            log_success "加密套件安全"
            ((ssl_score += 10))
        fi
    fi
    
    # 输出SSL安全评分
    local final_score=$((ssl_score > 0 ? ssl_score : 0))
    echo ""
    log_info "SSL安全评分: $final_score/$max_score"
    
    if [[ ${#ssl_issues[@]} -gt 0 ]]; then
        log_warning "发现SSL安全问题:"
        for issue in "${ssl_issues[@]}"; do
            echo "  - $issue"
        done
    fi
    
    return ${#ssl_issues[@]}
}

# HTTP安全头检查
header_security_check() {
    log_scan "执行HTTP安全头检查..."
    
    local header_issues=()
    local security_score=0
    local max_score=100
    
    # 获取HTTP响应头
    local headers=$(curl -s -I --max-time 10 "$TARGET_URL" 2>/dev/null || echo "")
    
    if [[ -z "$headers" ]]; then
        log_error "无法获取HTTP响应头"
        return 1
    fi
    
    # 检查安全头
    local security_headers=(
        "Strict-Transport-Security:HSTS头缺失:15"
        "X-Content-Type-Options:X-Content-Type-Options头缺失:10"
        "X-Frame-Options:X-Frame-Options头缺失:15"
        "X-XSS-Protection:X-XSS-Protection头缺失:10"
        "Content-Security-Policy:CSP头缺失:20"
        "Referrer-Policy:Referrer-Policy头缺失:5"
        "Permissions-Policy:Permissions-Policy头缺失:5"
    )
    
    for header_info in "${security_headers[@]}"; do
        IFS=':' read -r header_name issue_desc score_deduction <<< "$header_info"
        
        if echo "$headers" | grep -qi "^$header_name:"; then
            log_success "$header_name 头存在"
            ((security_score += score_deduction))
        else
            log_warning "$issue_desc"
            header_issues+=("$issue_desc")
        fi
    done
    
    # 检查危险头
    local dangerous_headers=(
        "Server:服务器信息泄露:5"
        "X-Powered-By:技术栈信息泄露:5"
        "X-AspNet-Version:ASP.NET版本泄露:3"
    )
    
    for header_info in "${dangerous_headers[@]}"; do
        IFS=':' read -r header_name issue_desc score_deduction <<< "$header_info"
        
        if echo "$headers" | grep -qi "^$header_name:"; then
            log_warning "$issue_desc"
            header_issues+=("$issue_desc")
            ((security_score -= score_deduction))
        else
            log_success "未发现 $header_name 头"
        fi
    done
    
    # 检查Cookie安全属性
    log_info "检查Cookie安全属性..."
    local cookie_headers=$(echo "$headers" | grep -i "^Set-Cookie:" || echo "")
    
    if [[ -n "$cookie_headers" ]]; then
        if echo "$cookie_headers" | grep -qi "Secure"; then
            log_success "Cookie设置了Secure属性"
            ((security_score += 5))
        else
            log_warning "Cookie未设置Secure属性"
            header_issues+=("Cookie缺少Secure属性")
        fi
        
        if echo "$cookie_headers" | grep -qi "HttpOnly"; then
            log_success "Cookie设置了HttpOnly属性"
            ((security_score += 5))
        else
            log_warning "Cookie未设置HttpOnly属性"
            header_issues+=("Cookie缺少HttpOnly属性")
        fi
        
        if echo "$cookie_headers" | grep -qi "SameSite"; then
            log_success "Cookie设置了SameSite属性"
            ((security_score += 5))
        else
            log_warning "Cookie未设置SameSite属性"
            header_issues+=("Cookie缺少SameSite属性")
        fi
    else
        log_info "未检测到Cookie设置"
    fi
    
    # 输出安全头评分
    local final_score=$((security_score > 0 ? security_score : 0))
    echo ""
    log_info "HTTP安全头评分: $final_score/$max_score"
    
    if [[ ${#header_issues[@]} -gt 0 ]]; then
        log_warning "发现HTTP安全头问题:"
        for issue in "${header_issues[@]}"; do
            echo "  - $issue"
        done
    fi
    
    return ${#header_issues[@]}
}

# 漏洞扫描
vulnerability_scan() {
    log_scan "执行漏洞扫描..."
    
    local vuln_issues=()
    
    # SQL注入检测
    log_info "检测SQL注入漏洞..."
    local sql_payloads=("'" "\"" "1' OR '1'='1" "1\" OR \"1\"=\"1")
    
    for payload in "${sql_payloads[@]}"; do
        local test_url="${API_URL}/api/articles?search=${payload}"
        local response=$(curl -s --max-time 5 "$test_url" 2>/dev/null || echo "")
        
        if echo "$response" | grep -qi "error\|exception\|mysql\|sql"; then
            log_error "可能存在SQL注入漏洞"
            vuln_issues+=("可能存在SQL注入漏洞")
            break
        fi
    done
    
    if [[ ${#vuln_issues[@]} -eq 0 ]]; then
        log_success "未检测到明显的SQL注入漏洞"
    fi
    
    # XSS检测
    log_info "检测XSS漏洞..."
    local xss_payloads=("<script>alert('xss')</script>" "javascript:alert('xss')" "<img src=x onerror=alert('xss')>")
    
    for payload in "${xss_payloads[@]}"; do
        local test_url="${API_URL}/api/articles?search=${payload}"
        local response=$(curl -s --max-time 5 "$test_url" 2>/dev/null || echo "")
        
        if echo "$response" | grep -q "$payload"; then
            log_error "可能存在XSS漏洞"
            vuln_issues+=("可能存在XSS漏洞")
            break
        fi
    done
    
    if [[ ${#vuln_issues[@]} -eq 1 ]] || [[ ${#vuln_issues[@]} -eq 0 ]]; then
        log_success "未检测到明显的XSS漏洞"
    fi
    
    # 目录遍历检测
    log_info "检测目录遍历漏洞..."
    local path_payloads=("../../../etc/passwd" "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts")
    
    for payload in "${path_payloads[@]}"; do
        local test_url="${API_URL}/api/files?path=${payload}"
        local response=$(curl -s --max-time 5 "$test_url" 2>/dev/null || echo "")
        
        if echo "$response" | grep -qE "root:|localhost"; then
            log_error "可能存在目录遍历漏洞"
            vuln_issues+=("可能存在目录遍历漏洞")
            break
        fi
    done
    
    if [[ ${#vuln_issues[@]} -le 2 ]]; then
        log_success "未检测到明显的目录遍历漏洞"
    fi
    
    # 检查敏感文件暴露
    log_info "检查敏感文件暴露..."
    local sensitive_files=(
        "/.env"
        "/config.properties"
        "/application.properties"
        "/web.xml"
        "/.git/config"
        "/composer.json"
        "/package.json"
    )
    
    for file in "${sensitive_files[@]}"; do
        local test_url="${TARGET_URL}${file}"
        local status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$test_url" 2>/dev/null || echo "000")
        
        if [[ "$status" == "200" ]]; then
            log_error "敏感文件暴露: $file"
            vuln_issues+=("敏感文件暴露: $file")
        fi
    done
    
    echo ""
    if [[ ${#vuln_issues[@]} -gt 0 ]]; then
        log_warning "发现潜在漏洞:"
        for issue in "${vuln_issues[@]}"; do
            echo "  - $issue"
        done
    else
        log_success "未发现明显漏洞"
    fi
    
    return ${#vuln_issues[@]}
}

# 配置安全检查
config_security_check() {
    log_scan "执行配置安全检查..."
    
    local config_issues=()
    
    # 检查Docker配置
    if command -v docker &> /dev/null; then
        log_info "检查Docker安全配置..."
        
        # 检查容器是否以root用户运行
        local containers=$(docker ps --format "{{.Names}}" 2>/dev/null || echo "")
        
        for container in $containers; do
            local user_info=$(docker exec "$container" whoami 2>/dev/null || echo "unknown")
            
            if [[ "$user_info" == "root" ]]; then
                log_warning "容器 $container 以root用户运行"
                config_issues+=("容器以root用户运行: $container")
            else
                log_success "容器 $container 使用非root用户"
            fi
        done
        
        # 检查容器特权模式
        local privileged_containers=$(docker ps --filter "label=privileged=true" --format "{{.Names}}" 2>/dev/null || echo "")
        
        if [[ -n "$privileged_containers" ]]; then
            log_error "发现特权模式容器: $privileged_containers"
            config_issues+=("特权模式容器: $privileged_containers")
        else
            log_success "未发现特权模式容器"
        fi
    fi
    
    # 检查文件权限
    log_info "检查关键文件权限..."
    local critical_files=(
        "docker-compose.yml:644"
        "docker-compose.prod.yml:644"
        ".env:600"
        "deploy.sh:755"
        "backup.sh:755"
    )
    
    for file_info in "${critical_files[@]}"; do
        IFS=':' read -r file expected_perm <<< "$file_info"
        
        if [[ -f "$file" ]]; then
            local actual_perm=$(stat -f "%A" "$file" 2>/dev/null || echo "000")
            
            if [[ "$actual_perm" == "$expected_perm" ]]; then
                log_success "文件权限正确: $file ($actual_perm)"
            else
                log_warning "文件权限不当: $file (实际: $actual_perm, 期望: $expected_perm)"
                config_issues+=("文件权限不当: $file")
            fi
        fi
    done
    
    # 检查环境变量安全
    log_info "检查环境变量安全..."
    if [[ -f ".env" ]]; then
        if grep -q "password.*=.*123456\|secret.*=.*test" ".env" 2>/dev/null; then
            log_error "发现弱密码或测试密钥"
            config_issues+=("使用弱密码或测试密钥")
        else
            log_success "未发现明显的弱密码"
        fi
    fi
    
    echo ""
    if [[ ${#config_issues[@]} -gt 0 ]]; then
        log_warning "发现配置安全问题:"
        for issue in "${config_issues[@]}"; do
            echo "  - $issue"
        done
    else
        log_success "配置安全检查通过"
    fi
    
    return ${#config_issues[@]}
}

# 依赖安全检查
dependency_security_check() {
    log_scan "执行依赖安全检查..."
    
    local dep_issues=()
    
    # 检查前端依赖
    if [[ -f "blog-frontend/blog-app/package.json" ]]; then
        log_info "检查前端依赖安全..."
        
        cd blog-frontend/blog-app
        
        if command -v npm &> /dev/null; then
            local audit_result=$(npm audit --json 2>/dev/null || echo '{"vulnerabilities":{}}')
            local vuln_count=$(echo "$audit_result" | grep -o '"vulnerabilities":{[^}]*}' | grep -o '"[^"]*":[0-9]*' | wc -l || echo "0")
            
            if [[ $vuln_count -gt 0 ]]; then
                log_error "前端依赖存在 $vuln_count 个安全漏洞"
                dep_issues+=("前端依赖安全漏洞: $vuln_count 个")
            else
                log_success "前端依赖安全检查通过"
            fi
        fi
        
        cd - > /dev/null
    fi
    
    # 检查后端依赖
    if [[ -f "blog-backend/pom.xml" ]]; then
        log_info "检查后端依赖安全..."
        
        # 检查已知的有漏洞的依赖版本
        local vulnerable_deps=(
            "spring-boot.*1\.[0-4]\.:Spring Boot 1.x版本存在安全漏洞"
            "jackson.*2\.[0-8]\.:Jackson 2.8及以下版本存在安全漏洞"
            "mysql-connector.*5\.:MySQL Connector 5.x版本存在安全漏洞"
        )
        
        for dep_pattern in "${vulnerable_deps[@]}"; do
            IFS=':' read -r pattern issue_desc <<< "$dep_pattern"
            
            if grep -qE "$pattern" "blog-backend/pom.xml" 2>/dev/null; then
                log_error "$issue_desc"
                dep_issues+=("$issue_desc")
            fi
        done
    fi
    
    echo ""
    if [[ ${#dep_issues[@]} -gt 0 ]]; then
        log_warning "发现依赖安全问题:"
        for issue in "${dep_issues[@]}"; do
            echo "  - $issue"
        done
    else
        log_success "依赖安全检查通过"
    fi
    
    return ${#dep_issues[@]}
}

# 生成安全报告
generate_security_report() {
    log_info "生成安全扫描报告..."
    
    local report_file="$REPORT_DIR/security_report_${TIMESTAMP}.html"
    
    cat > "$report_file" << EOF
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>博客系统安全扫描报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; border-left: 4px solid #007bff; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .pass { color: #28a745; font-weight: bold; }
        .warn { color: #ffc107; font-weight: bold; }
        .fail { color: #dc3545; font-weight: bold; }
        .critical { color: #dc3545; font-weight: bold; background-color: #f8d7da; padding: 2px 4px; border-radius: 3px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .score { font-size: 24px; font-weight: bold; }
        .recommendations { background-color: #e7f3ff; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔒 博客系统安全扫描报告</h1>
        <p><strong>扫描时间:</strong> $(date)</p>
        <p><strong>扫描类型:</strong> $SCAN_TYPE</p>
        <p><strong>目标URL:</strong> $TARGET_URL</p>
        <p><strong>API URL:</strong> $API_URL</p>
    </div>
    
    <div class="section">
        <h2>📊 安全评分概览</h2>
        <div class="score">总体安全评分: <span id="overall-score">计算中...</span>/100</div>
        <p>评分说明: 90-100(优秀) | 70-89(良好) | 50-69(一般) | 30-49(较差) | 0-29(危险)</p>
    </div>
    
    <div class="section">
        <h2>🔐 SSL/TLS安全检查</h2>
        <div id="ssl-results">检查中...</div>
    </div>
    
    <div class="section">
        <h2>🛡️ HTTP安全头检查</h2>
        <div id="header-results">检查中...</div>
    </div>
    
    <div class="section">
        <h2>🔍 漏洞扫描结果</h2>
        <div id="vuln-results">扫描中...</div>
    </div>
    
    <div class="section">
        <h2>⚙️ 配置安全检查</h2>
        <div id="config-results">检查中...</div>
    </div>
    
    <div class="section">
        <h2>📦 依赖安全检查</h2>
        <div id="dependency-results">检查中...</div>
    </div>
    
    <div class="section recommendations">
        <h2>💡 安全建议</h2>
        <ul>
            <li>定期更新系统和依赖包</li>
            <li>使用强密码和多因素认证</li>
            <li>配置适当的HTTP安全头</li>
            <li>启用HTTPS并配置HSTS</li>
            <li>定期进行安全扫描和渗透测试</li>
            <li>实施最小权限原则</li>
            <li>监控和记录安全事件</li>
            <li>制定安全事件响应计划</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>📋 详细扫描日志</h2>
        <pre id="scan-logs">加载中...</pre>
    </div>
</body>
</html>
EOF
    
    log_success "安全扫描报告已生成: $report_file"
}

# 自动修复安全问题
auto_fix_issues() {
    if [[ "$AUTO_FIX" != "true" ]]; then
        return 0
    fi
    
    log_info "尝试自动修复安全问题..."
    
    local fixed_count=0
    
    # 修复文件权限
    if [[ -f ".env" ]]; then
        chmod 600 .env
        log_success "修复 .env 文件权限"
        ((fixed_count++))
    fi
    
    if [[ -f "deploy.sh" ]]; then
        chmod 755 deploy.sh
        log_success "修复 deploy.sh 文件权限"
        ((fixed_count++))
    fi
    
    if [[ -f "backup.sh" ]]; then
        chmod 755 backup.sh
        log_success "修复 backup.sh 文件权限"
        ((fixed_count++))
    fi
    
    log_info "自动修复完成，共修复 $fixed_count 个问题"
}

# 主扫描函数
perform_security_scan() {
    log_info "开始安全扫描..."
    log_info "扫描类型: $SCAN_TYPE"
    
    local total_issues=0
    
    case "$SCAN_TYPE" in
        "all")
            ssl_security_check; ((total_issues += $?))
            header_security_check; ((total_issues += $?))
            vulnerability_scan; ((total_issues += $?))
            config_security_check; ((total_issues += $?))
            dependency_security_check; ((total_issues += $?))
            ;;
        "ssl")
            ssl_security_check; ((total_issues += $?))
            ;;
        "headers")
            header_security_check; ((total_issues += $?))
            ;;
        "vulns")
            vulnerability_scan; ((total_issues += $?))
            ;;
        "config")
            config_security_check; ((total_issues += $?))
            ;;
        "deps")
            dependency_security_check; ((total_issues += $?))
            ;;
        *)
            log_error "未知的扫描类型: $SCAN_TYPE"
            exit 1
            ;;
    esac
    
    # 自动修复
    auto_fix_issues
    
    # 生成报告
    if [[ "$GENERATE_REPORT" == "true" ]]; then
        generate_security_report
    fi
    
    echo ""
    log_info "安全扫描完成，发现 $total_issues 个安全问题"
    
    if [[ $total_issues -eq 0 ]]; then
        log_success "恭喜！未发现严重安全问题"
        return 0
    elif [[ $total_issues -le 5 ]]; then
        log_warning "发现少量安全问题，建议及时修复"
        return 1
    else
        log_error "发现较多安全问题，请立即修复"
        return 2
    fi
}

# 主函数
main() {
    echo "博客系统安全扫描脚本"
    echo "==========================================="
    echo "扫描类型: $SCAN_TYPE"
    echo "目标URL: $TARGET_URL"
    echo "API URL: $API_URL"
    echo "生成报告: $GENERATE_REPORT"
    echo "自动修复: $AUTO_FIX"
    echo ""
    
    # 检查依赖
    check_dependencies
    
    # 执行安全扫描
    local exit_code=0
    if ! perform_security_scan; then
        exit_code=$?
    fi
    
    if [[ "$GENERATE_REPORT" == "true" ]]; then
        log_info "安全报告保存在: $REPORT_DIR"
    fi
    
    exit $exit_code
}

# 执行主函数
main "$@"