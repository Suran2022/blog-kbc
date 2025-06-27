#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 配置信息
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="blog"
DB_USER="root"
DB_PASS="qhdx2023-"

echo -e "${YELLOW}正在检查MySQL数据库连接...${NC}"

# 检查MySQL客户端是否安装
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}错误: MySQL客户端未安装${NC}"
    echo -e "请安装MySQL客户端后再运行此脚本"
    echo -e "在macOS上，可以使用以下命令安装："
    echo -e "  brew install mysql-client"
    exit 1
fi

# 测试MySQL连接
echo -e "尝试连接到MySQL服务器 ${DB_HOST}:${DB_PORT}..."
if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}MySQL连接成功!${NC}"
    
    # 检查数据库是否存在
    echo -e "检查数据库 ${DB_NAME} 是否存在..."
    if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -e "USE ${DB_NAME};" &> /dev/null; then
        echo -e "${GREEN}数据库 ${DB_NAME} 已存在!${NC}"
    else
        echo -e "${YELLOW}数据库 ${DB_NAME} 不存在，正在创建...${NC}"
        if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" &> /dev/null; then
            echo -e "${GREEN}数据库 ${DB_NAME} 创建成功!${NC}"
        else
            echo -e "${RED}创建数据库 ${DB_NAME} 失败!${NC}"
            echo -e "请手动创建数据库或检查用户权限"
            exit 1
        fi
    fi
else
    echo -e "${RED}MySQL连接失败!${NC}"
    echo -e "请检查以下可能的原因："
    echo -e "1. MySQL服务未启动"
    echo -e "2. 用户名或密码错误"
    echo -e "3. 主机名或端口错误"
    echo -e "4. 防火墙阻止连接"
    
    echo -e "\n${YELLOW}尝试启动MySQL服务...${NC}"
    echo -e "在macOS上，可以尝试以下命令："
    echo -e "  sudo mysql.server start"
    echo -e "或者："
    echo -e "  brew services start mysql"
    
    exit 1
fi

echo -e "\n${GREEN}数据库检查完成!${NC}"
echo -e "您现在可以运行应用程序了"