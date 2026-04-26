#!/bin/bash
set -e

# ============================================
# A2CMS 部署脚本 - Alibaba Cloud Linux 3
# ============================================

# 配置
REPO_URL="https://github.com/oryzivora/A2CMS.git"
DEPLOY_DIR="/var/www/a2cms"
NGINX_CONF="/etc/nginx/conf.d/a2cms.conf"
BRANCH="main"  # 代码分支，根据实际调整

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    log_error "请使用 root 用户运行此脚本"
    exit 1
fi

log_info "开始部署 A2CMS..."

# 0. 安装 Git
log_info "检查并安装 Git..."
if ! command -v git &> /dev/null; then
    yum install -y git
    log_info "Git 安装完成: $(git --version)"
else
    log_warn "Git 已安装: $(git --version)"
fi

# 1. 安装 Node.js 20.x (最新 LTS 版本)
log_info "检查并安装 Node.js..."
NODE_VERSION="v20.17.0"
if ! command -v node &> /dev/null; then
    # 使用淘宝 Node.js 镜像
    curl -fsSL https://npmmirror.com/mirrors/node/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz | tar -xJ -C /usr/local --strip-components=1
    log_info "Node.js 安装完成: $(node --version)"
else
    log_warn "Node.js 已安装: $(node --version)"
fi

# 2. 安装 pnpm (使用淘宝镜像)
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm --registry=https://registry.npmmirror.com
    log_info "pnpm 安装完成: $(pnpm --version)"
else
    log_warn "pnpm 已安装: $(pnpm --version)"
fi

# 3. 创建部署目录
log_info "创建部署目录..."
mkdir -p $DEPLOY_DIR

# 4. 克隆或更新代码
if [ -d "$DEPLOY_DIR/.git" ]; then
    log_info "更新代码..."
    cd $DEPLOY_DIR
    git pull origin $BRANCH
else
    log_info "克隆代码仓库..."
    git clone -b $BRANCH $REPO_URL $DEPLOY_DIR
    cd $DEPLOY_DIR
fi

# 5. 安装依赖 (使用淘宝镜像)
log_info "安装项目依赖..."
pnpm install --registry=https://registry.npmmirror.com

# 6. 构建项目
log_info "构建项目..."
pnpm build

# 7. 创建 Nginx 配置文件
log_info "创建 Nginx 配置文件..."
cat > $NGINX_CONF << EOF
server {
    listen 80;
    server_name _;

    root $DEPLOY_DIR/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}
EOF

# 8. 测试 Nginx 配置
log_info "测试 Nginx 配置..."
nginx -t

# 9. 重启 Nginx
log_info "重启 Nginx..."
systemctl restart nginx
systemctl enable nginx

# 10. 设置目录权限
chown -R nginx:nginx $DEPLOY_DIR

log_info "========================================"
log_info "部署完成!"
log_info "访问地址: http://\$(hostname -I | awk '{print \$1}')"
log_info "代码目录: $DEPLOY_DIR"
log_info "========================================"
