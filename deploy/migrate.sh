#!/bin/bash

# 博客系统数据库迁移脚本
# 使用方法: ./migrate.sh [--action=ACTION] [--version=VERSION] [--force] [--backup]

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
ACTION="status"
TARGET_VERSION=""
FORCE=false
BACKUP_BEFORE_MIGRATE=true
MIGRATION_DIR="./migrations"
BACKUP_DIR="./backups/migrations"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 数据库配置
MYSQL_CONTAINER="blog-mysql-prod"
MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-root123456}"
MYSQL_DATABASE="blog"
MYSQL_USER="${MYSQL_USER:-blog_user}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-blog_password}"

# 迁移表名
MIGRATION_TABLE="schema_migrations"

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --action=*)
            ACTION="${1#*=}"
            shift
            ;;
        --version=*)
            TARGET_VERSION="${1#*=}"
            shift
            ;;
        --force|-f)
            FORCE=true
            shift
            ;;
        --no-backup)
            BACKUP_BEFORE_MIGRATE=false
            shift
            ;;
        --migration-dir=*)
            MIGRATION_DIR="${1#*=}"
            shift
            ;;
        --help|-h)
            echo "使用方法: $0 [选项]"
            echo "选项:"
            echo "  --action=ACTION        迁移操作 (status|up|down|create|reset，默认: status)"
            echo "  --version=VERSION      目标版本号"
            echo "  --force, -f            强制执行，跳过确认"
            echo "  --no-backup            迁移前不创建备份"
            echo "  --migration-dir=PATH   迁移文件目录 (默认: ./migrations)"
            echo "  --help, -h             显示帮助"
            echo ""
            echo "操作说明:"
            echo "  status  - 显示迁移状态"
            echo "  up      - 执行向上迁移（升级）"
            echo "  down    - 执行向下迁移（降级）"
            echo "  create  - 创建新的迁移文件"
            echo "  reset   - 重置数据库（危险操作）"
            echo ""
            echo "示例:"
            echo "  $0 --action=status                    # 查看迁移状态"
            echo "  $0 --action=up                        # 执行所有待执行的迁移"
            echo "  $0 --action=up --version=20231201001  # 迁移到指定版本"
            echo "  $0 --action=down --version=20231201001 # 回滚到指定版本"
            echo "  $0 --action=create                    # 创建新迁移文件"
            exit 0
            ;;
        *)
            echo "未知选项: $1"
            exit 1
            ;;
    esac
done

# 创建必要目录
mkdir -p "$MIGRATION_DIR"
mkdir -p "$BACKUP_DIR"

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

log_migrate() {
    echo -e "${MAGENTA}[MIGRATE]${NC} $1"
}

# 检查数据库连接
check_database_connection() {
    log_info "检查数据库连接..."
    
    if ! docker ps | grep -q "$MYSQL_CONTAINER"; then
        log_error "MySQL容器未运行: $MYSQL_CONTAINER"
        exit 1
    fi
    
    if docker exec "$MYSQL_CONTAINER" mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1" >/dev/null 2>&1; then
        log_success "数据库连接正常"
    else
        log_error "数据库连接失败"
        exit 1
    fi
}

# 初始化迁移表
init_migration_table() {
    log_info "初始化迁移表..."
    
    local sql="
CREATE TABLE IF NOT EXISTS $MIGRATION_TABLE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INT DEFAULT 0,
    checksum VARCHAR(64),
    INDEX idx_version (version),
    INDEX idx_executed_at (executed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"
    
    if docker exec "$MYSQL_CONTAINER" mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" -e "$sql" 2>/dev/null; then
        log_success "迁移表初始化完成"
    else
        log_error "迁移表初始化失败"
        exit 1
    fi
}

# 获取已执行的迁移
get_executed_migrations() {
    docker exec "$MYSQL_CONTAINER" mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" \
        -e "SELECT version FROM $MIGRATION_TABLE ORDER BY version;" -s -N 2>/dev/null || echo ""
}

# 获取待执行的迁移
get_pending_migrations() {
    local executed_migrations=()
    while IFS= read -r version; do
        [[ -n "$version" ]] && executed_migrations+=("$version")
    done <<< "$(get_executed_migrations)"
    
    local pending_migrations=()
    
    for migration_file in "$MIGRATION_DIR"/*.sql; do
        if [[ -f "$migration_file" ]]; then
            local filename=$(basename "$migration_file")
            local version=$(echo "$filename" | sed 's/^\([0-9]\{8,14\}\)_.*/\1/')
            
            # 检查是否已执行
            local is_executed=false
            for executed in "${executed_migrations[@]}"; do
                if [[ "$executed" == "$version" ]]; then
                    is_executed=true
                    break
                fi
            done
            
            if [[ "$is_executed" == "false" ]]; then
                pending_migrations+=("$version:$filename")
            fi
        fi
    done
    
    # 排序
    printf '%s\n' "${pending_migrations[@]}" | sort
}

# 显示迁移状态
show_migration_status() {
    log_info "数据库迁移状态"
    echo ""
    
    # 显示已执行的迁移
    echo -e "${GREEN}已执行的迁移:${NC}"
    local executed_migrations=$(get_executed_migrations)
    
    if [[ -n "$executed_migrations" ]]; then
        while IFS= read -r version; do
            if [[ -n "$version" ]]; then
                local migration_info=$(docker exec "$MYSQL_CONTAINER" mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" \
                    -e "SELECT description, executed_at FROM $MIGRATION_TABLE WHERE version='$version';" -s -N 2>/dev/null)
                
                IFS=$'\t' read -r description executed_at <<< "$migration_info"
                echo "  ✓ $version - $description ($executed_at)"
            fi
        done <<< "$executed_migrations"
    else
        echo "  (无)"
    fi
    
    echo ""
    
    # 显示待执行的迁移
    echo -e "${YELLOW}待执行的迁移:${NC}"
    local pending_migrations=$(get_pending_migrations)
    
    if [[ -n "$pending_migrations" ]]; then
        while IFS= read -r migration_info; do
            if [[ -n "$migration_info" ]]; then
                IFS=':' read -r version filename <<< "$migration_info"
                local description=$(head -n 5 "$MIGRATION_DIR/$filename" | grep "^-- Description:" | sed 's/^-- Description: *//' || echo "无描述")
                echo "  ○ $version - $description"
            fi
        done <<< "$pending_migrations"
    else
        echo "  (无)"
    fi
    
    echo ""
}

# 创建备份
create_migration_backup() {
    if [[ "$BACKUP_BEFORE_MIGRATE" != "true" ]]; then
        return 0
    fi
    
    log_info "创建迁移前备份..."
    
    local backup_file="$BACKUP_DIR/pre_migration_${TIMESTAMP}.sql"
    
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
        
        log_success "备份创建完成: $backup_file"
        return 0
    else
        log_error "备份创建失败"
        return 1
    fi
}

# 计算文件校验和
calculate_checksum() {
    local file="$1"
    
    if [[ -f "$file" ]]; then
        shasum -a 256 "$file" | cut -d' ' -f1
    else
        echo ""
    fi
}

# 执行单个迁移
execute_migration() {
    local migration_file="$1"
    local direction="$2"  # up 或 down
    
    if [[ ! -f "$migration_file" ]]; then
        log_error "迁移文件不存在: $migration_file"
        return 1
    fi
    
    local filename=$(basename "$migration_file")
    local version=$(echo "$filename" | sed 's/^\([0-9]\{8,14\}\)_.*/\1/')
    local description=$(head -n 5 "$migration_file" | grep "^-- Description:" | sed 's/^-- Description: *//' || echo "无描述")
    
    log_migrate "执行迁移: $version - $description"
    
    # 提取SQL语句
    local sql_content=""
    local in_section=false
    local target_section="-- UP"
    
    if [[ "$direction" == "down" ]]; then
        target_section="-- DOWN"
    fi
    
    while IFS= read -r line; do
        if [[ "$line" == "$target_section" ]]; then
            in_section=true
            continue
        elif [[ "$line" =~ ^--\ (UP|DOWN)$ ]] && [[ "$in_section" == "true" ]]; then
            break
        elif [[ "$in_section" == "true" ]] && [[ ! "$line" =~ ^--.*$ ]]; then
            sql_content+="$line\n"
        fi
    done < "$migration_file"
    
    if [[ -z "$sql_content" ]]; then
        log_error "未找到 $direction 部分的SQL语句"
        return 1
    fi
    
    # 执行SQL
    local start_time=$(date +%s%3N)
    
    if echo -e "$sql_content" | docker exec -i "$MYSQL_CONTAINER" mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"; then
        local end_time=$(date +%s%3N)
        local execution_time=$((end_time - start_time))
        
        # 更新迁移记录
        if [[ "$direction" == "up" ]]; then
            local checksum=$(calculate_checksum "$migration_file")
            
            docker exec "$MYSQL_CONTAINER" mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" \
                -e "INSERT INTO $MIGRATION_TABLE (version, description, execution_time_ms, checksum) VALUES ('$version', '$description', $execution_time, '$checksum');"
        else
            docker exec "$MYSQL_CONTAINER" mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" \
                -e "DELETE FROM $MIGRATION_TABLE WHERE version='$version';"
        fi
        
        log_success "迁移执行成功 (${execution_time}ms)"
        return 0
    else
        log_error "迁移执行失败"
        return 1
    fi
}

# 执行向上迁移
migrate_up() {
    log_info "执行向上迁移..."
    
    local pending_migrations=$(get_pending_migrations)
    
    if [[ -z "$pending_migrations" ]]; then
        log_info "没有待执行的迁移"
        return 0
    fi
    
    # 创建备份
    if ! create_migration_backup; then
        if [[ "$FORCE" != "true" ]]; then
            log_error "备份失败，迁移中止"
            return 1
        else
            log_warning "备份失败，但强制继续执行"
        fi
    fi
    
    local success_count=0
    local total_count=0
    
    while IFS= read -r migration_info; do
        if [[ -n "$migration_info" ]]; then
            IFS=':' read -r version filename <<< "$migration_info"
            
            # 检查是否达到目标版本
            if [[ -n "$TARGET_VERSION" ]] && [[ "$version" > "$TARGET_VERSION" ]]; then
                break
            fi
            
            ((total_count++))
            
            if execute_migration "$MIGRATION_DIR/$filename" "up"; then
                ((success_count++))
            else
                log_error "迁移失败，停止执行"
                break
            fi
        fi
    done <<< "$pending_migrations"
    
    log_info "向上迁移完成: $success_count/$total_count 成功"
    
    if [[ $success_count -eq $total_count ]]; then
        return 0
    else
        return 1
    fi
}

# 执行向下迁移
migrate_down() {
    log_info "执行向下迁移..."
    
    if [[ -z "$TARGET_VERSION" ]]; then
        log_error "向下迁移需要指定目标版本"
        return 1
    fi
    
    # 确认操作
    if [[ "$FORCE" != "true" ]]; then
        echo -e "${YELLOW}警告: 向下迁移可能导致数据丢失！${NC}"
        echo "目标版本: $TARGET_VERSION"
        read -p "确定要继续吗？(y/N): " -n 1 -r
        echo
        
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "操作已取消"
            return 0
        fi
    fi
    
    # 创建备份
    if ! create_migration_backup; then
        if [[ "$FORCE" != "true" ]]; then
            log_error "备份失败，迁移中止"
            return 1
        else
            log_warning "备份失败，但强制继续执行"
        fi
    fi
    
    # 获取需要回滚的迁移
    local executed_migrations=$(get_executed_migrations | sort -r)
    local success_count=0
    local total_count=0
    
    while IFS= read -r version; do
        if [[ -n "$version" ]] && [[ "$version" > "$TARGET_VERSION" ]]; then
            # 查找对应的迁移文件
            local migration_file=""
            for file in "$MIGRATION_DIR"/*.sql; do
                if [[ -f "$file" ]] && [[ "$(basename "$file")" =~ ^${version}_ ]]; then
                    migration_file="$file"
                    break
                fi
            done
            
            if [[ -n "$migration_file" ]]; then
                ((total_count++))
                
                if execute_migration "$migration_file" "down"; then
                    ((success_count++))
                else
                    log_error "迁移回滚失败，停止执行"
                    break
                fi
            else
                log_warning "未找到版本 $version 的迁移文件，跳过"
            fi
        fi
    done <<< "$executed_migrations"
    
    log_info "向下迁移完成: $success_count/$total_count 成功"
    
    if [[ $success_count -eq $total_count ]]; then
        return 0
    else
        return 1
    fi
}

# 创建新迁移文件
create_migration() {
    log_info "创建新迁移文件..."
    
    # 获取迁移描述
    local description=""
    if [[ "$FORCE" != "true" ]]; then
        read -p "请输入迁移描述: " description
    fi
    
    if [[ -z "$description" ]]; then
        description="New migration"
    fi
    
    # 生成版本号
    local version=$(date +"%Y%m%d%H%M%S")
    local filename="${version}_$(echo "$description" | tr ' ' '_' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9_]//g').sql"
    local filepath="$MIGRATION_DIR/$filename"
    
    # 创建迁移文件
    cat > "$filepath" << EOF
-- Migration: $version
-- Description: $description
-- Created: $(date)
-- Author: $(whoami)

-- UP
-- 在此处添加向上迁移的SQL语句
-- 例如:
-- CREATE TABLE example (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- DOWN
-- 在此处添加向下迁移的SQL语句（回滚操作）
-- 例如:
-- DROP TABLE IF EXISTS example;
EOF
    
    log_success "迁移文件已创建: $filepath"
    log_info "请编辑文件并添加相应的SQL语句"
    
    return 0
}

# 重置数据库
reset_database() {
    log_warning "重置数据库（危险操作）"
    
    # 确认操作
    if [[ "$FORCE" != "true" ]]; then
        echo -e "${RED}警告: 此操作将删除所有数据并重新初始化数据库！${NC}"
        echo "数据库: $MYSQL_DATABASE"
        read -p "确定要继续吗？请输入 'RESET' 确认: " confirmation
        
        if [[ "$confirmation" != "RESET" ]]; then
            log_info "操作已取消"
            return 0
        fi
    fi
    
    # 创建备份
    if ! create_migration_backup; then
        log_error "备份失败，重置操作中止"
        return 1
    fi
    
    log_info "删除所有表..."
    
    # 获取所有表名
    local tables=$(docker exec "$MYSQL_CONTAINER" mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" \
        -e "SHOW TABLES;" -s -N 2>/dev/null || echo "")
    
    if [[ -n "$tables" ]]; then
        # 禁用外键检查
        docker exec "$MYSQL_CONTAINER" mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" \
            -e "SET FOREIGN_KEY_CHECKS = 0;"
        
        # 删除所有表
        while IFS= read -r table; do
            if [[ -n "$table" ]]; then
                docker exec "$MYSQL_CONTAINER" mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" \
                    -e "DROP TABLE IF EXISTS \`$table\`;"
                log_info "删除表: $table"
            fi
        done <<< "$tables"
        
        # 启用外键检查
        docker exec "$MYSQL_CONTAINER" mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" \
            -e "SET FOREIGN_KEY_CHECKS = 1;"
    fi
    
    # 重新初始化迁移表
    init_migration_table
    
    # 执行所有迁移
    log_info "执行所有迁移..."
    migrate_up
    
    log_success "数据库重置完成"
    return 0
}

# 主函数
main() {
    echo "博客系统数据库迁移脚本"
    echo "==========================================="
    echo "操作: $ACTION"
    echo "目标版本: ${TARGET_VERSION:-"最新"}"
    echo "强制模式: $FORCE"
    echo "迁移目录: $MIGRATION_DIR"
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
    
    # 检查数据库连接
    check_database_connection
    
    # 初始化迁移表
    init_migration_table
    
    # 执行操作
    case "$ACTION" in
        "status")
            show_migration_status
            ;;
        "up")
            if migrate_up; then
                log_success "向上迁移完成"
                show_migration_status
            else
                log_error "向上迁移失败"
                exit 1
            fi
            ;;
        "down")
            if migrate_down; then
                log_success "向下迁移完成"
                show_migration_status
            else
                log_error "向下迁移失败"
                exit 1
            fi
            ;;
        "create")
            if create_migration; then
                log_success "迁移文件创建完成"
            else
                log_error "迁移文件创建失败"
                exit 1
            fi
            ;;
        "reset")
            if reset_database; then
                log_success "数据库重置完成"
            else
                log_error "数据库重置失败"
                exit 1
            fi
            ;;
        *)
            log_error "未知操作: $ACTION"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"