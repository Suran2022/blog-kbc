#!/bin/bash

# 博客系统恢复脚本
# 使用方法: ./restore.sh [--backup-dir=PATH] [--type=all|db|files] [--force]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
RESTORE_TYPE="all"
FORCE=false
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
        --backup-dir=*)
            BACKUP_DIR="${1#*=}"
            DB_BACKUP_DIR="$BACKUP_DIR/database"
            FILE_BACKUP_DIR="$BACKUP_DIR/files"
            LOG_BACKUP_DIR="$BACKUP_DIR/logs"
            shift
            ;;
        --type=*)
            RESTORE_TYPE="${1#*=}"
            shift
            ;;
        --force|-f)
            FORCE=true
            shift
            ;;
        --help|-h)
            echo "使用方法: $0 [选项]"
            echo "选项:"
            echo "  --backup-dir=PATH  备份目录路径 (默认: ./backups)"
            echo "  --type=TYPE        恢复类型 (all|db|files，默认: all)"
            echo "  --force, -f        强制恢复，不进行确认"
            echo "  --help, -h         显示帮助"
            echo ""
            echo "恢复类型说明:"
            echo "  all    - 恢复数据库和文件"
            echo "  db     - 仅恢复数据库"
            echo "  files  - 仅恢复文件"
            echo ""
            echo "注意事项:"
            echo "  - 恢复操作会覆盖现有数据，请谨慎操作"
            echo "  - 建议在恢复前先备份当前数据"
            echo "  - 恢复过程中服务可能会暂时不可用"
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

# 确认操作
confirm_operation() {
    if [[ "$FORCE" == "true" ]]; then
        return 0
    fi
    
    echo -e "${YELLOW}警告: 此操作将覆盖现有数据！${NC}"
    echo "恢复类型: $RESTORE_TYPE"
    echo "备份目录: $BACKUP_DIR"
    echo ""
    read -p "确定要继续吗？(y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "操作已取消"
        exit 0
    fi
}

# 检查备份目录
check_backup_dir() {
    log_info "检查备份目录..."
    
    if [[ ! -d "$BACKUP_DIR" ]]; then
        log_error "备份目录不存在: $BACKUP_DIR"
        exit 1
    fi
    
    log_success "备份目录检查完成"
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

# 列出可用备份
list_available_backups() {
    log_info "可用的备份文件:"
    echo ""
    
    if [[ -d "$DB_BACKUP_DIR" ]]; then
        echo "数据库备份:"
        find "$DB_BACKUP_DIR" -name "*.sql*" -type f -exec ls -lht {} \; | head -10
        echo ""
    fi
    
    if [[ -d "$FILE_BACKUP_DIR" ]]; then
        echo "文件备份:"
        find "$FILE_BACKUP_DIR" -name "*.tar*" -type f -exec ls -lht {} \; | head -10
        echo ""
    fi
}

# 选择备份文件
select_backup_file() {
    local backup_type="$1"
    local backup_dir="$2"
    local pattern="$3"
    
    log_info "选择${backup_type}备份文件..."
    
    # 获取备份文件列表
    local files=()
    while IFS= read -r -d '' file; do
        files+=("$file")
    done < <(find "$backup_dir" -name "$pattern" -type f -print0 | sort -z)
    
    if [[ ${#files[@]} -eq 0 ]]; then
        log_error "未找到${backup_type}备份文件"
        return 1
    fi
    
    # 如果只有一个文件，直接使用
    if [[ ${#files[@]} -eq 1 ]]; then
        echo "${files[0]}"
        return 0
    fi
    
    # 显示文件列表供选择
    echo "请选择要恢复的${backup_type}备份文件:"
    for i in "${!files[@]}"; do
        local file="${files[$i]}"
        local size=$(ls -lh "$file" | awk '{print $5}')
        local date=$(ls -l "$file" | awk '{print $6, $7, $8}')
        echo "  $((i+1)). $(basename "$file") ($size, $date)"
    done
    
    while true; do
        read -p "请输入选择 (1-${#files[@]}): " choice
        if [[ "$choice" =~ ^[0-9]+$ ]] && [[ $choice -ge 1 ]] && [[ $choice -le ${#files[@]} ]]; then
            echo "${files[$((choice-1))]}"
            return 0
        else
            echo "无效选择，请重新输入"
        fi
    done
}

# 解压文件
decompress_file() {
    local file="$1"
    
    if [[ "$file" == *.gz ]]; then
        log_info "解压文件: $(basename "$file")"
        local decompressed="${file%.gz}"
        
        if gunzip -c "$file" > "$decompressed"; then
            echo "$decompressed"
            return 0
        else
            log_error "文件解压失败: $file"
            return 1
        fi
    else
        echo "$file"
        return 0
    fi
}

# 恢复MySQL数据库
restore_mysql() {
    log_info "开始恢复MySQL数据库..."
    
    # 选择备份文件
    local backup_file
    if ! backup_file=$(select_backup_file "MySQL" "$DB_BACKUP_DIR" "mysql_*.sql*"); then
        return 1
    fi
    
    log_info "使用备份文件: $(basename "$backup_file")"
    
    # 解压文件（如果需要）
    local sql_file
    if ! sql_file=$(decompress_file "$backup_file"); then
        return 1
    fi
    
    # 确认数据库恢复
    if [[ "$FORCE" != "true" ]]; then
        echo -e "${YELLOW}警告: 此操作将完全替换数据库 '$MYSQL_DATABASE' 的所有数据！${NC}"
        read -p "确定要继续吗？(y/N): " -n 1 -r
        echo
        
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "MySQL恢复已取消"
            # 清理临时文件
            if [[ "$sql_file" != "$backup_file" ]]; then
                rm -f "$sql_file"
            fi
            return 0
        fi
    fi
    
    # 停止应用服务（避免数据不一致）
    log_info "停止应用服务..."
    docker-compose -f docker-compose.prod.yml stop blog-backend || true
    
    # 执行数据库恢复
    log_info "执行数据库恢复..."
    if docker exec -i "$MYSQL_CONTAINER" mysql \
        -u root \
        -p"$MYSQL_ROOT_PASSWORD" \
        "$MYSQL_DATABASE" < "$sql_file"; then
        
        log_success "MySQL数据库恢复完成"
        
        # 重启应用服务
        log_info "重启应用服务..."
        docker-compose -f docker-compose.prod.yml start blog-backend
        
        # 清理临时文件
        if [[ "$sql_file" != "$backup_file" ]]; then
            rm -f "$sql_file"
        fi
        
        return 0
    else
        log_error "MySQL数据库恢复失败"
        
        # 重启应用服务
        docker-compose -f docker-compose.prod.yml start blog-backend
        
        # 清理临时文件
        if [[ "$sql_file" != "$backup_file" ]]; then
            rm -f "$sql_file"
        fi
        
        return 1
    fi
}

# 恢复Redis数据
restore_redis() {
    log_info "开始恢复Redis数据..."
    
    # 选择备份文件
    local backup_file
    if ! backup_file=$(select_backup_file "Redis" "$DB_BACKUP_DIR" "redis_*.rdb*"); then
        return 1
    fi
    
    log_info "使用备份文件: $(basename "$backup_file")"
    
    # 解压文件（如果需要）
    local rdb_file
    if ! rdb_file=$(decompress_file "$backup_file"); then
        return 1
    fi
    
    # 停止Redis容器
    log_info "停止Redis容器..."
    docker-compose -f docker-compose.prod.yml stop blog-redis
    
    # 复制RDB文件
    log_info "恢复Redis数据文件..."
    if docker cp "$rdb_file" "${REDIS_CONTAINER}:/data/dump.rdb"; then
        # 启动Redis容器
        log_info "启动Redis容器..."
        docker-compose -f docker-compose.prod.yml start blog-redis
        
        # 等待Redis启动
        sleep 5
        
        # 验证Redis连接
        if docker exec "$REDIS_CONTAINER" redis-cli ping | grep -q "PONG"; then
            log_success "Redis数据恢复完成"
            
            # 清理临时文件
            if [[ "$rdb_file" != "$backup_file" ]]; then
                rm -f "$rdb_file"
            fi
            
            return 0
        else
            log_error "Redis启动失败"
            
            # 清理临时文件
            if [[ "$rdb_file" != "$backup_file" ]]; then
                rm -f "$rdb_file"
            fi
            
            return 1
        fi
    else
        log_error "Redis数据文件复制失败"
        
        # 启动Redis容器
        docker-compose -f docker-compose.prod.yml start blog-redis
        
        # 清理临时文件
        if [[ "$rdb_file" != "$backup_file" ]]; then
            rm -f "$rdb_file"
        fi
        
        return 1
    fi
}

# 恢复上传文件
restore_uploads() {
    log_info "开始恢复上传文件..."
    
    # 选择备份文件
    local backup_file
    if ! backup_file=$(select_backup_file "上传文件" "$FILE_BACKUP_DIR" "uploads_*.tar*"); then
        return 1
    fi
    
    log_info "使用备份文件: $(basename "$backup_file")"
    
    # 解压文件（如果需要）
    local tar_file
    if ! tar_file=$(decompress_file "$backup_file"); then
        return 1
    fi
    
    # 备份现有上传文件
    if [[ -d "./uploads" ]]; then
        log_info "备份现有上传文件..."
        mv "./uploads" "./uploads.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # 恢复上传文件
    log_info "恢复上传文件..."
    if tar -xf "$tar_file" -C .; then
        log_success "上传文件恢复完成"
        
        # 设置权限
        chmod -R 755 ./uploads/
        
        # 清理临时文件
        if [[ "$tar_file" != "$backup_file" ]]; then
            rm -f "$tar_file"
        fi
        
        return 0
    else
        log_error "上传文件恢复失败"
        
        # 恢复原有文件
        if [[ -d "./uploads.backup.$(date +%Y%m%d_%H%M%S)" ]]; then
            mv "./uploads.backup.$(date +%Y%m%d_%H%M%S)" "./uploads"
        fi
        
        # 清理临时文件
        if [[ "$tar_file" != "$backup_file" ]]; then
            rm -f "$tar_file"
        fi
        
        return 1
    fi
}

# 恢复配置文件
restore_configs() {
    log_info "开始恢复配置文件..."
    
    # 选择备份文件
    local backup_file
    if ! backup_file=$(select_backup_file "配置文件" "$FILE_BACKUP_DIR" "configs_*.tar*"); then
        return 1
    fi
    
    log_info "使用备份文件: $(basename "$backup_file")"
    
    # 解压文件（如果需要）
    local tar_file
    if ! tar_file=$(decompress_file "$backup_file"); then
        return 1
    fi
    
    # 创建临时目录
    local temp_dir="/tmp/blog_config_restore_$$"
    mkdir -p "$temp_dir"
    
    # 解压到临时目录
    if tar -xf "$tar_file" -C "$temp_dir"; then
        log_info "恢复配置文件..."
        
        # 备份现有配置
        local backup_suffix=".backup.$(date +%Y%m%d_%H%M%S)"
        
        [[ -d "mysql" ]] && mv "mysql" "mysql${backup_suffix}"
        [[ -d "redis" ]] && mv "redis" "redis${backup_suffix}"
        [[ -d "nginx" ]] && mv "nginx" "nginx${backup_suffix}"
        [[ -d "monitoring" ]] && mv "monitoring" "monitoring${backup_suffix}"
        [[ -f "docker-compose.yml" ]] && mv "docker-compose.yml" "docker-compose.yml${backup_suffix}"
        [[ -f "docker-compose.prod.yml" ]] && mv "docker-compose.prod.yml" "docker-compose.prod.yml${backup_suffix}"
        [[ -f ".env.example" ]] && mv ".env.example" ".env.example${backup_suffix}"
        
        # 恢复配置文件
        cp -r "$temp_dir"/* .
        
        log_success "配置文件恢复完成"
        
        # 清理临时目录
        rm -rf "$temp_dir"
        
        # 清理临时文件
        if [[ "$tar_file" != "$backup_file" ]]; then
            rm -f "$tar_file"
        fi
        
        return 0
    else
        log_error "配置文件恢复失败"
        
        # 清理临时目录
        rm -rf "$temp_dir"
        
        # 清理临时文件
        if [[ "$tar_file" != "$backup_file" ]]; then
            rm -f "$tar_file"
        fi
        
        return 1
    fi
}

# 主恢复函数
perform_restore() {
    log_info "开始执行恢复任务..."
    
    local success_count=0
    local total_count=0
    
    case "$RESTORE_TYPE" in
        "all")
            log_info "执行完整恢复..."
            
            # 数据库恢复
            ((total_count++))
            if restore_mysql; then
                ((success_count++))
            fi
            
            ((total_count++))
            if restore_redis; then
                ((success_count++))
            fi
            
            # 文件恢复
            ((total_count++))
            if restore_uploads; then
                ((success_count++))
            fi
            
            ((total_count++))
            if restore_configs; then
                ((success_count++))
            fi
            ;;
        "db")
            log_info "执行数据库恢复..."
            
            ((total_count++))
            if restore_mysql; then
                ((success_count++))
            fi
            
            ((total_count++))
            if restore_redis; then
                ((success_count++))
            fi
            ;;
        "files")
            log_info "执行文件恢复..."
            
            ((total_count++))
            if restore_uploads; then
                ((success_count++))
            fi
            
            ((total_count++))
            if restore_configs; then
                ((success_count++))
            fi
            ;;
        *)
            log_error "未知的恢复类型: $RESTORE_TYPE"
            exit 1
            ;;
    esac
    
    log_info "恢复任务完成: $success_count/$total_count 成功"
    
    if [[ $success_count -eq $total_count ]]; then
        log_success "所有恢复任务执行成功"
        return 0
    else
        log_warning "部分恢复任务执行失败"
        return 1
    fi
}

# 主函数
main() {
    echo "博客系统恢复脚本"
    echo "==========================================="
    echo "恢复类型: $RESTORE_TYPE"
    echo "备份目录: $BACKUP_DIR"
    echo "强制模式: $FORCE"
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
    
    # 检查备份目录
    check_backup_dir
    
    # 列出可用备份
    list_available_backups
    
    # 确认操作
    confirm_operation
    
    # 检查容器状态
    check_containers
    
    # 执行恢复
    if perform_restore; then
        log_success "恢复任务全部完成"
        log_info "建议重启所有服务以确保配置生效"
        exit 0
    else
        log_error "恢复任务执行失败"
        exit 1
    fi
}

# 执行主函数
main "$@"