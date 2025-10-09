## 项目简介

一款后台管理系统模块，它前端基于 [react](https://react.dev/) 和 [antd](https://ant.design/) ，后端基于 node 的后端框架 [nestjs](https://docs.nestjs.com/) ，数据库采用 mysql ，缓存采用 redis。

## 在线体验

- [演示地址](localhost:888/login) 账号密码（admin admin123 和 guest guest123）

## 技术要求

- [React](https://react.dev/)
- [Antd](https://ant.design/)
- [TypeScript](https://www.tslang.cn/index.html)
- [Nestjs](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/)
- Mysql
- Redis

## 技术选型

1. **前端技术**

- react
- react-router
- antd
- redux

2. **后端技术**

- nest @10.3.2
- prisma @5.12.1
- ioredis @5.4.1

## 内置功能

- 用户管理：用户是系统操作者，该功能主要完成系统用户配置。
- 部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
- 岗位管理：配置系统用户所属担任职务。
- 菜单管理：配置系统菜单，操作权限，按钮权限标识等。
- 角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
- 字典管理：对系统中经常使用的一些较为固定的数据进行维护。
- 参数管理：对系统动态配置常用参数。
- 通知公告：系统通知公告信息发布维护。
- 操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
- 登录日志：系统登录日志记录查询包含登录异常。
- 在线用户：当前系统中活跃用户状态监控。
- 定时任务：在线（添加、修改、删除)任务调度包含执行结果日志。
- 系统接口：根据业务代码自动生成相关的 api 接口文档。
- 服务监控：监视当前系统 CPU、内存、磁盘、堆栈等相关信息。
- 缓存监控：对系统的缓存信息查询，命令统计等。
- 缓存列表：查看 redis 的缓存情况
- 在线构建器：拖动表单元素生成相应的 Vue 代码。

## 目录结构

```
    meimei
    ├── prisma                          #数据库模型和迁移模块
    ├── static                          #静态文件
    │   └── upload                      #上传文件夹
    ├── src
    │   ├── common
    │   │   ├── class                   #公共返回值包装类
    │   │   ├── contants                #系统常量
    │   │   ├── decorators              #装饰器
    │   │   ├── dto                     #数据模型
    │   │   ├── entities                #公共实体模型
    │   │   ├── enums                   #枚举
    │   │   ├── exceptions              #全局错误拦截器
    │   │   ├── filters                 #全局错误过滤器
    │   │   ├── guards                  #全局守卫
    │   │   ├── interceptors            #装饰器
    │   │   ├── interface               #公共接口
    │   │   └── pipes                   #公共管道
    │   │   └── type                    #公共类型
    │   ├── config
    │   │   ├── config.dev              #开发环境配置文件
    │   │   ├── config.pro              #正式环境配置文件
    │   │   ├── index
    │   ├── modules                     #业务模块文件夹
    │   │   ├── common                  #导入导出和上传模块
    │   │   ├── login                   #登录模块
    │   │   ├── monitor                 #系统监控
    │   │   └── system                  #系统管理
    │   ├── shared
    │   │   ├── prisma                  #数据库连接定义
    │   │   ├── shared.module.ts        #公共模块
    │   │   └── shared.service.ts       #公共方法
    │   ├── app.module.ts
    │   ├── main.ts
    ├── test
    │   ├── app.e2e-spec.ts
    │   └── jest-e2e.json
    ├── .eslintrc.js
    ├── .prettierrc
    ├── admin-prisma.sql                     #初始化sql语句
    ├── nest-cli.json
    ├── package.json
    ├── tsconfig.build.json
    ├── tsconfig.json
    └── yarn.lock
```

## 前期准备

```
node >= 18 (本人是最新的20.13.1)
npm >= 6.14.15
mysql >= 5.70
redis >= 3.0
```

提示：npm 或 yarn 最好设置淘宝镜像，推荐使用 yarn 进行安装

## 运行系统

### 后端运行

- 前往 github 下载页面 (槑槑管理系统) 进行代码拉取。
- 拉去代码里面包含 React 的前端项目和 nestjs 的后端项目。
- 分别进入对应项目进行依赖包的安装。yarn 或者 npm install
- 创建数据库并命名 admin-prisma （排序：utf8mb4_unicode_ci）
- 执行在后端程序根目录下执行 yarn db:g （prisma 根据模型层生成数据库脚本文件，可在 prisma 官网查询运行部署）
- 执行初始化数据库文件(根目录下的 admin-prisma.sql)
- 修改数据库连接，编辑后端项目根目录下的 .env 文件。 DATABASE_URL 是数据库地址，SHADOW_DATABASE_URL 是影子数据库地址（prisma 开发阶段使用的，是个空库就行了）。
- 启动你的 redis（该项目必须要使用 redis）。
- 修改后端项目中 src/config/config.dev.ts 你可以在里面更改运行的端口，redis 连接等信息 （里面备注写的非常清楚）。
- 修改前端项目根目录下的 vite.config.ts 文件，修改 server 配前你需要的前端代理。
- 前后端均使用 npm dev 或者 yarn dev 进行运行。

### 具体操作

修改数据库配置，编辑后端项目下 .env 文件

```
  # 文件下的内容会被nest-config自动加载进入环境变量中
  # 运行环境
    NODE_ENV="development"
  # NODE_ENV="production"
  # 操作的数据库   //  connection_limit=20设置20个连接池 ，pool_timeout=0 禁用连接池超时
  # 示例       mysql://账号:密码@ip:端口/数据库名称?connection_limit=连接池数量&pool_timeout=连接超时时间(0表示一直等待)
              # mysql://root:123456@127.0.0.1:3306/admin-prisma?connection_limit=20&pool_timeout=0
  DATABASE_URL="mysql://root:123456@127.0.0.1:3306/admin-prisma?connection_limit=20&pool_timeout=0"

  # 影子数据库是第二个临时数据库，每次运行 prisma migrate dev 时都会自动创建和删除*，主要用于检测问题，例如架构偏移或生成的迁移的潜在数据丢失。
  SHADOW_DATABASE_URL="mysql://test_db:123456@203.25.211.232:3306/test_db"
```

修改 redis 连接，编辑后端项目下 src/config/config.dev.ts

```
<!-- 缓存redis -->
  redis: {
    host: 'localhost',
    port: '6379',
    password: '123456',
    db: 0,
  },
```

修改前端代理，编辑前端项目下 vite.config.ts

```
    server: {
      port: 80,
      host: true,
      open: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        "/dev-api": {
          target: "http://127.0.0.1:3000",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, ""),
        },
      },
    },
```
