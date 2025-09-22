// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始数据初始化...');

  // 1. 插入字典类型
  const dictType = await prisma.sysDictType.upsert({
    where: { dictType: 'sys_user_sex' },
    update: {},
    create: {
      dictName: '性别',
      dictType: 'sys_user_sex',
      status: '0',
      createBy: 'admin',
      remark: '用户性别',
    },
  });
  console.log('✅ SysDictType 已创建:', dictType.dictType);

  // 1.1 插入字典数据
  const dictData = await prisma.sysDictData.create({
    data: {
      dictLabel: '男',
      dictValue: '0',
      dictType: 'sys_user_sex',
      dictSort: 1,
      status: '0',
      createBy: 'admin',
    },
  });
  console.log('✅ SysDictData 已创建:', dictData.dictLabel);

  // 2. 插入部门（顶级部门）
  const dept = await prisma.sysDept.create({
    data: {
      deptName: '总公司',
      parentId: null,
      ancestors: '0',
      orderNum: 0,
      status: '0',
      createBy: 'admin',
    },
  });
  console.log('✅ SysDept 已创建:', dept.deptName);

  // 3. 插入岗位
  const post = await prisma.sysPost.create({
    data: {
      postCode: `POST${Date.now() % 10000}`,
      postName: '系统管理员',
      postSort: 1,
      status: '0',
      createBy: 'admin',
    },
  });
  console.log('✅ SysPost 已创建:', post.postName);

  // 4. 插入角色
  const role = await prisma.sysRole.create({
    data: {
      roleName: '超级管理员',
      roleKey: 'admin',
      roleSort: 1,
      status: '0',
      dataScope: '1', // 所有数据
      createBy: 'admin',
      remark: '内置管理员角色',
    },
  });
  console.log('✅ SysRole 已创建:', role.roleName);

  // 5. 插入菜单（根菜单）
  const sysMenu = await prisma.sysMenu.create({
    data: {
      menuName: '系统管理',
      parentId: null,
      orderNum: 1,
      path: 'system',
      component: 'Layout',
      menuType: 'M',
      visible: '0',
      status: '0',
      icon: 'system',
      perms: null,
      createBy: 'admin',
    },
  });

  const userMenu = await prisma.sysMenu.create({
    data: {
      menuName: '用户管理',
      parentId: sysMenu.menuId,
      orderNum: 1,
      path: 'user',
      component: '/System/User/index',
      menuType: 'C',
      visible: '0',
      status: '0',
      icon: 'system',
      perms: 'system:user:list',
      createBy: 'admin',
    },
  });
  console.log('✅ SysMenu 已创建');

  // 6. 创建用户（关联部门、岗位、角色）
  const user = await prisma.sysUser.create({
    data: {
      userName: 'admin',
      nickName: '超级管理员',
      password: '$2b$10$eOA3TW08QKta3zRSlhY6f.RXnOuzDwM0OGWAYh8zwVYMFwCkF.dme', // 明文密码应由你加密
      phonenumber: '13888888888',
      email: 'admin@example.com',
      sex: '0',
      status: '0',
      createBy: 'system',
      dept: {
        connect: { deptId: dept.deptId },
      },
      posts: {
        connect: { postId: post.postId },
      },
      roles: {
        connect: { roleId: role.roleId },
      },
    },
  });
  console.log('✅ SysUser 已创建:', user.userName);

  // 7. 插入用户个性化设置（SysWeb）
  const web = await prisma.sysWeb.create({
    data: {
      userId: user.userId,
      theme: 'default',
      createBy: 'system',
    },
  });
  console.log('✅ SysWeb 已创建:', web.userId);

  // 8. 插入系统配置
  const config = await prisma.sysConfig.create({
    data: {
      configName: '主框架页-默认皮肤样式名称',
      configKey: 'sys.index.skinName',
      configValue: '蓝色皮肤',
      configType: 'Y',
      createBy: 'admin',
      remark: '默认 skin-blue',
    },
  });
  console.log('✅ SysConfig 已创建:', config.configKey);

  // 9. （可选）给角色分配菜单权限
  await prisma.sysRole.update({
    where: { roleId: role.roleId },
    data: {
      menus: {
        connect: { menuId: menu.menuId },
      },
    },
  });
  console.log('✅ 角色已分配菜单权限');

  // 10. （可选）给角色分配部门数据权限
  await prisma.sysRole.update({
    where: { roleId: role.roleId },
    data: {
      depts: {
        connect: { deptId: dept.deptId },
      },
    },
  });
  console.log('✅ 角色已分配部门数据权限');

  console.log('🎉 数据初始化完成！');
}

main()
  .catch((e) => {
    console.error('❌ 数据初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });