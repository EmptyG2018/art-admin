# Docker Compose 快速部署指南

本文档提供了使用 Docker Compose 快速部署 Art Admin 管理系统的完整指南。

## 📋 系统要求

- Docker 20.10+
- Docker Compose 2.0+
- 至少 4GB 可用内存
- 至少 10GB 可用磁盘空间

## 🚀 快速开始

### 1. 克隆项目并进入目录

```bash
git clone <your-repository-url>
cd admin-template
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量（根据需要修改）
vim .env
```

### 3. 启动所有服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 4. 初始化数据库

```bash
# 等待数据库启动完成后，运行数据库迁移
docker-compose exec backend yarn db:g
docker-compose exec backend yarn db:m
docker-compose exec backend yarn db:seed
```

### 5. 访问应用

- 前端应用：http://localhost
- 后端 API：http://localhost:3000
- 数据库：localhost:3306
- Redis：localhost:6379

## 📁 项目结构

```
admin-template/
├── Dockerfile                 # 后端 Dockerfile
├── docker-compose.yml         # Docker Compose 配置
├── .env.example              # 环境变量模板
├── .dockerignore             # Docker 忽略文件
├── healthcheck.js            # 健康检查脚本
├── web/
│   ├── Dockerfile            # 前端 Dockerfile
│   └── nginx.conf            # Nginx 配置
└── DOCKER_DEPLOYMENT.md      # 部署文档
```

## ⚙️ 服务配置

### MySQL 数据库
- 端口：3306
- 数据库：art_admin
- 用户名：art_admin
- 密码：art123456（可在 .env 中修改）

### Redis 缓存
- 端口：6379
- 密码：redis123456（可在 .env 中修改）

### 后端服务
- 端口：3000
- 基于 NestJS 框架
- 支持 API 文档：http://localhost:3000/api

### 前端服务
- 端口：80
- 基于 React + Vite
- 使用 Nginx 提供静态文件服务

## 🔧 常用命令

### 服务管理

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 重启特定服务
docker-compose restart backend

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f [service-name]
```

### 数据库操作

```bash
# 连接到 MySQL
docker-compose exec mysql mysql -u art_admin -p art_admin

# 备份数据库
docker-compose exec mysql mysqldump -u art_admin -p art_admin > backup.sql

# 恢复数据库
docker-compose exec -T mysql mysql -u art_admin -p art_admin < backup.sql
```

### 应用更新

```bash
# 重新构建并启动服务
docker-compose up -d --build

# 仅重新构建特定服务
docker-compose build backend
docker-compose up -d backend
```

## 🛠️ 开发模式

如果需要在开发模式下运行：

```bash
# 仅启动数据库和 Redis
docker-compose up -d mysql redis

# 本地运行后端
cd /path/to/project
yarn install
yarn dev

# 本地运行前端
cd web
yarn install
yarn dev
```

## 📊 监控和日志

### 健康检查

所有服务都配置了健康检查：

```bash
# 查看健康状态
docker-compose ps

# 手动执行健康检查
docker-compose exec backend node healthcheck.js
```

### 日志管理

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs backend

# 实时跟踪日志
docker-compose logs -f --tail=100

# 查看错误日志
docker-compose logs | grep ERROR
```

## 🔒 安全配置

### 生产环境建议

1. **修改默认密码**：
   ```bash
   # 在 .env 文件中修改
   MYSQL_ROOT_PASSWORD=your-strong-password
   MYSQL_PASSWORD=your-strong-password
   REDIS_PASSWORD=your-strong-password
   JWT_SECRET=your-super-secret-jwt-key
   ```

2. **使用 HTTPS**：
   - 配置 SSL 证书
   - 修改 Nginx 配置支持 HTTPS

3. **网络安全**：
   - 限制数据库和 Redis 的外部访问
   - 使用防火墙规则

4. **数据备份**：
   - 定期备份数据库
   - 备份上传文件

## 🐛 故障排除

### 常见问题

1. **端口冲突**：
   ```bash
   # 修改 .env 文件中的端口配置
   FRONTEND_PORT=8080
   BACKEND_PORT=3001
   ```

2. **数据库连接失败**：
   ```bash
   # 检查数据库是否启动
   docker-compose logs mysql
   
   # 重启数据库服务
   docker-compose restart mysql
   ```

3. **内存不足**：
   ```bash
   # 清理未使用的镜像和容器
   docker system prune -a
   ```

4. **权限问题**：
   ```bash
   # 修复文件权限
   sudo chown -R $USER:$USER ./static
   ```

### 日志分析

```bash
# 查看错误日志
docker-compose logs | grep -i error

# 查看数据库连接日志
docker-compose logs backend | grep -i database

# 查看 Nginx 访问日志
docker-compose exec frontend tail -f /var/log/nginx/access.log
```

## 📞 技术支持

如果遇到问题，请：

1. 查看服务日志：`docker-compose logs [service-name]`
2. 检查服务状态：`docker-compose ps`
3. 验证环境配置：`cat .env`
4. 查看资源使用：`docker stats`

## 📝 更新日志

- v1.0.0：初始版本，支持基本的 Docker Compose 部署
- 支持的服务：MySQL、Redis、NestJS 后端、React 前端
- 包含健康检查、日志管理、安全配置等功能