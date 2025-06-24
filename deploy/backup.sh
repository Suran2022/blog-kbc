#!/bin/bash

# 博客系统备份脚本
# 使用方法: ./backup.sh [--type=all|db|files] [--compress] [--cleanup]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
BACKUP_TYPE="all"
COMPRESS=false
CLEANUP=false
RETENTION_DAYS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 路径配置
BACKUP_DIR="./backups"
DB_BACKUP_DIR="$BACKUP_DIR/database"
FILE_BACKUP_DIR="$BACKUP_DIR/files"
LOG_BACKUP_DIR="$BACKUP_DIR/logs"

# 容器配置
MYSQL_CONTAINER="blog-mysql-prod"
REDIS_CONTAINER="blog-redis-prod"
MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-root123456}"
MYSQL_DATABASE="blog"

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --type=*)
            BACKUP_TYPE="${1#*=}"
            shift
            ;;
        --compress|-c)
            COMPRESS=true
            shift
            ;;
        --cleanup)
            CLEANUP=true
            shift
            ;;
        --retention=*)
            RETENTION_DAYS="${1#*=}"
            shift
            ;;
        --help|-h)
            echo "使用方法: $0 [选项]"
            echo "选项:"
            echo "  --type=TYPE      备份类型 (all|db|files，默认: all)"
            echo "  --compress, -c   压缩备份文件"
            echo "  --cleanup        清理过期备份"
            echo "  --retention=DAYS 备份保留天数 (默认: 30)"
            echo "  --help, -h       显示帮助"
            echo ""
            echo "备份类型说明:"
            echo "  all    - 备份数据库和文件"
            echo "  db     - 仅备份数据库"
            echo "  files  - 仅备份文件"
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

# 创建备份目录
create_backup_dirs() {
    log_info "创建备份目录..."
    
    mkdir -p "$DB_BACKUP_DIR"
    mkdir -p "$FILE_BACKUP_DIR"
    mkdir -p "$LOG_BACKUP_DIR"
    
    log_success "备份目录创建完成"
}

# 检查容器状态
check_containers() {
    log_info "检查容器状态..."
    
    if ! docker ps | grep -q "$MYSQL_CONTAINER"; then
        log_error "MySQL容器未运行: $MYSQL_CONTAINER"
        exit 1
    fi
    
    if ! docker ps | grep -q "$REDIS_CONTAINER"; then
        log_warning "Redis容器未运行: $REDIS_CONTAINER"
    fi
    
    log_success "容器状态检查完成"
}

# 备份MySQL数据库
backup_mysql() {
    log_info "开始备份MySQL数据库..."
    
    local backup_file="$DB_BACKUP_DIR/mysql_${MYSQL_DATABASE}_${TIMESTAMP}.sql"
    
    # 执行数据库备份
    if docker exec "$MYSQL_CONTAINER" mysqldump \
        -u root \
        -p"$MYSQL_ROOT_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        --events \
        --hex-blob \
        --default-character-set=utf8mb4 \
        "$MYSQL_DATABASE" > "$backup_file"; then
        
        log_success "MySQL数据库备份完成: $backup_file"
        
        # 压缩备份文件
        if [[ "$COMPRESS" == "true" ]]; then
            log_info "压缩数据库备份文件..."
            gzip "$backup_file"
            log_success "数据库备份文件压缩完成: ${backup_file}.gz"
        fi
        
        return 0
    else
        log_error "MySQL数据库备份失败"
        return 1
    fi
}

# 备份Redis数据
backup_redis() {
    log_info "开始备份Redis数据..."
    
    local backup_file="$DB_BACKUP_DIR/redis_${TIMESTAMP}.rdb"
    
    # 触发Redis保存
    if docker exec "$REDIS_CONTAINER" redis-cli BGSAVE; then
        # 等待保存完成
        sleep 5
        
        # 复制RDB文件
        if docker cp "${REDIS_CONTAINER}:/data/dump.rdb" "$backup_file"; then
            log_success "Redis数据备份完成: $backup_file"
            
            # 压缩备份文件
            if [[ "$COMPRESS" == "true" ]]; then
                log_info "压缩Redis备份文件..."
                gzip "$backup_file"
                log_success "Redis备份文件压缩完成: ${backup_file}.gz"
            fi
            
            return 0
        else
            log_error "Redis数据复制失败"
            return 1
        fi
    else
        log_error "Redis数据保存失败"
        return 1
    fi
}

# 备份上传文件
backup_uploads() {
    log_info "开始备份上传文件..."
    
    local backup_file="$FILE_BACKUP_DIR/uploads_${TIMESTAMP}.tar"
    
    if [[ -d "./uploads" ]]; then
        if tar -cf "$backup_file" -C . uploads/; then
            log_success "上传文件备份完成: $backup_file"
            
            # 压缩备份文件
            if [[ "$COMPRESS" == "true" ]]; then
                log_info "压缩上传文件备份..."
                gzip "$backup_file"
                log_success "上传文件备份压缩完成: ${backup_file}.gz"
            fi
            
            return 0
        else
            log_error "上传文件备份失败"
            return 1
        fi
    else
        log_warning "上传文件目录不存在，跳过备份"
        return 0
    fi
}

# 备份配置文件
backup_configs() {
    log_info "开始备份配置文件..."
    
    local backup_file="$FILE_BACKUP_DIR/configs_${TIMESTAMP}.tar"
    
    # 创建临时目录
    local temp_dir="/tmp/blog_config_backup_$$"
    mkdir -p "$temp_dir"
    
    # 复制配置文件
    cp -r mysql/ "$temp_dir/" 2>/dev/null || true
    cp -r redis/ "$temp_dir/" 2>/dev/null || true
    cp -r nginx/ "$temp_dir/" 2>/dev/null || true
    cp -r monitoring/ "$temp_dir/" 2>/dev/null || true
    cp docker-compose*.yml "$temp_dir/" 2>/dev/null || true
    cp .env.example "$temp_dir/" 2>/dev/null || true
    
    if tar -cf "$backup_file" -C "$temp_dir" .; then
        log_success "配置文件备份完成: $backup_file"
        
        # 压缩备份文件
        if [[ "$COMPRESS" == "true" ]]; then
            log_info "压缩配置文件备份..."
            gzip "$backup_file"
            log_success "配置文件备份压缩完成: ${backup_file}.gz"
        fi
    else
        log_error "配置文件备份失败"
    fi
    
    # 清理临时目录
    rm -rf "$temp_dir"
}

# 备份日志文件
backup_logs() {
    log_info "开始备份日志文件..."
    
    local backup_file="$LOG_BACKUP_DIR/logs_${TIMESTAMP}.tar"
    
    if [[ -d "./logs" ]]; then
        if tar -cf "$backup_file" -C . logs/; then
            log_success "日志文件备份完成: $backup_file"
            
            # 压缩备份文件
            if [[ "$COMPRESS" == "true" ]]; then
                log_info "压缩日志文件备份..."
                gzip "$backup_file"
                log_success "日志文件备份压缩完成: ${backup_file}.gz"
            fi
        else
            log_error "日志文件备份失败"
        fi
    else
        log_warning "日志文件目录不存在，跳过备份"
    fi
}

# 清理过期备份
cleanup_old_backups() {
    log_info "清理过期备份文件..."
    
    local deleted_count=0
    
    # 清理数据库备份
    if [[ -d "$DB_BACKUP_DIR" ]]; then
        while IFS= read -r -d '' file; do
            rm "$file"
            ((deleted_count++))
        done < <(find "$DB_BACKUP_DIR" -type f -mtime +"$RETENTION_DAYS" -print0)
    fi
    
    # 清理文件备份
    if [[ -d "$FILE_BACKUP_DIR" ]]; then
        while IFS= read -r -d '' file; do
            rm "$file"
            ((deleted_count++))
        done < <(find "$FILE_BACKUP_DIR" -type f -mtime +"$RETENTION_DAYS" -print0)
    fi
    
    # 清理日志备份
    if [[ -d "$LOG_BACKUP_DIR" ]]; then
        while IFS= read -r -d '' file; do
            rm "$file"
            ((deleted_count++))
        done < <(find "$LOG_BACKUP_DIR" -type f -mtime +"$RETENTION_DAYS" -print0)
    fi
    
    if [[ $deleted_count -gt 0 ]]; then
        log_success "清理了 $deleted_count 个过期备份文件"
    else
        log_info "没有找到过期的备份文件"
    fi
}

# 生成备份报告
generate_report() {
    log_info "生成备份报告..."
    
    local report_file="$BACKUP_DIR/backup_report_${TIMESTAMP}.txt"
    
    {
        echo "博客系统备份报告"
        echo "==========================================="
        echo "备份时间: $(date)"
        echo "备份类型: $BACKUP_TYPE"
        echo "压缩选项: $COMPRESS"
        echo "保留天数: $RETENTION_DAYS"
        echo ""
        echo "备份文件列表:"
        echo "-------------------------------------------"
        
        if [[ -d "$DB_BACKUP_DIR" ]]; then
            echo "数据库备份:"
            find "$DB_BACKUP_DIR" -name "*${TIMESTAMP}*" -type f -exec ls -lh {} \;
            echo ""
        fi
        
        if [[ -d "$FILE_BACKUP_DIR" ]]; then
            echo "文件备份:"
            find "$FILE_BACKUP_DIR" -name "*${TIMESTAMP}*" -type f -exec ls -lh {} \;
            echo ""
        fi
        
        if [[ -d "$LOG_BACKUP_DIR" ]]; then
            echo "日志备份:"
            find "$LOG_BACKUP_DIR" -name "*${TIMESTAMP}*" -type f -exec ls -lh {} \;
            echo ""
        fi
        
        echo "备份目录总大小:"
        du -sh "$BACKUP_DIR"
        echo ""
        echo "磁盘空间使用情况:"
        df -h .
        
    } > "$report_file"
    
    log_success "备份报告生成完成: $report_file"
}

# 主备份函数
perform_backup() {
    log_info "开始执行备份任务..."
    
    local success_count=0
    local total_count=0
    
    case "$BACKUP_TYPE" in
        "all")
            log_info "执行完整备份..."
            
            # 数据库备份
            ((total_count++))
            if backup_mysql; then
                ((success_count++))
            fi
            
            ((total_count++))
            if backup_redis; then
                ((success_count++))
            fi
            
            # 文件备份
            ((total_count++))
            if backup_uploads; then
                ((success_count++))
            fi
            
            ((total_count++))
            if backup_configs; then
                ((success_count++))
            fi
            
            ((total_count++))
            if backup_logs; then
                ((success_count++))
            fi
            ;;
        "db")
            log_info "执行数据库备份..."
            
            ((total_count++))
            if backup_mysql; then
                ((success_count++))
            fi
            
            ((total_count++))
            if backup_redis; then
                ((success_count++))
            fi
            ;;
        "files")
            log_info "执行文件备份..."
            
            ((total_count++))
            if backup_uploads; then
                ((success_count++))
            fi
            
            ((total_count++))
            if backup_configs; then
                ((success_count++))
            fi
            
            ((total_count++))
            if backup_logs; then
                ((success_count++))
            fi
            ;;
        *)
            log_error "未知的备份类型: $BACKUP_TYPE"
            exit 1
            ;;
    esac
    
    log_info "备份任务完成: $success_count/$total_count 成功"
    
    if [[ $success_count -eq $total_count ]]; then
        log_success "所有备份任务执行成功"
        return 0
    else
        log_warning "部分备份任务执行失败"
        return 1
    fi
}

# 主函数
main() {
    echo "博客系统备份脚本"
    echo "==========================================="
    echo "备份类型: $BACKUP_TYPE"
    echo "压缩选项: $COMPRESS"
    echo "清理选项: $CLEANUP"
    echo "保留天数: $RETENTION_DAYS"
    echo "时间戳: $TIMESTAMP"
    echo ""
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装"
        exit 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker未运行"
        exit 1
    fi
    
    # 创建备份目录
    create_backup_dirs
    
    # 检查容器状态
    check_containers
    
    # 执行备份
    if perform_backup; then
        # 生成报告
        generate_report
        
        # 清理过期备份
        if [[ "$CLEANUP" == "true" ]]; then
            cleanup_old_backups
        fi
        
        log_success "备份任务全部完成"
        exit 0
    else
        log_error "备份任务执行失败"
        exit 1
    fi
}

# 执行主函数
main "$@"