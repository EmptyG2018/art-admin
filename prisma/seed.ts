const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // ======================
  // 1. 清理旧数据（可选，用于重置）
  // ======================
  // 注意：生产环境慎用
  await prisma.sysWeb.deleteMany({});
  await prisma.sysConfig.deleteMany({});
  await prisma.sysDictType.deleteMany({});
  await prisma.sysPost.deleteMany({});
  await prisma.sysMenu.deleteMany({});
  await prisma.sysDept.deleteMany({});
  await prisma.sysRole.deleteMany({});
  await prisma.sysUser.deleteMany({});


  // return;
  // ======================
  // 2. 创建部门 (SysDept)
  // ======================
  const rootDept = await prisma.sysDept.upsert({
    where: { deptId: 100 },
    update: {},
    create: {
      deptId: 100,
      parentId: null,
      ancestors: '0',
      deptName: '总公司',
      orderNum: 0,
      leader: 'admin',
      phone: '13888888888',
      email: 'admin@company.com',
      status: '0',
      delFlag: '0',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:16'),
    },
  });

  const dept101 = await prisma.sysDept.upsert({
    where: { deptId: 101 },
    update: {},
    create: {
      deptId: 101,
      parentId: 100,
      ancestors: '0,100',
      deptName: '研发部门',
      orderNum: 1,
      leader: 'techlead',
      phone: '13999999999',
      email: 'dev@company.com',
      status: '0',
      delFlag: '0',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:16'),
    },
  });

  const dept102 = await prisma.sysDept.upsert({
    where: { deptId: 102 },
    update: {},
    create: {
      deptId: 102,
      parentId: 100,
      ancestors: '0,100',
      deptName: '人事部门',
      orderNum: 2,
      leader: 'hrlead',
      phone: '13777777777',
      email: 'hr@company.com',
      status: '0',
      delFlag: '0',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:16'),
    },
  });

  console.log('✅ Departments seeded.');

  // ======================
  // 3. 创建岗位 (SysPost)
  // ======================
  await prisma.sysPost.upsert({
    where: { postId: 1 },
    update: {},
    create: {
      postId: 1,
      postCode: 'ceo',
      postName: '董事长',
      postSort: 1,
      status: '0',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:16'),
    },
  });

  await prisma.sysPost.upsert({
    where: { postId: 2 },
    update: {},
    create: {
      postId: 2,
      postCode: 'se',
      postName: '项目经理',
      postSort: 2,
      status: '0',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:16'),
    },
  });

  await prisma.sysPost.upsert({
    where: { postId: 3 },
    update: {},
    create: {
      postId: 3,
      postCode: 'hr',
      postName: '人力资源',
      postSort: 3,
      status: '0',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:16'),
    },
  });

  await prisma.sysPost.upsert({
    where: { postId: 4 },
    update: {},
    create: {
      postId: 4,
      postCode: 'user',
      postName: '普通员工',
      postSort: 4,
      status: '0',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:16'),
    },
  });

  console.log('✅ Posts seeded.');

  // ======================
  // 4. 创建角色 (SysRole)
  // ======================
  await prisma.sysRole.upsert({
    where: { roleId: 1 },
    update: {},
    create: {
      roleId: 1,
      roleName: '超级管理员',
      roleKey: 'admin',
      roleSort: 1,
      status: '0',
      dataScope: '1',
      delFlag: '0',
      deptCheckStrictly: true,
      menuCheckStrictly: true,
      remark: '超级管理员角色',
      createBy: 'admin',
      createTime: new Date('2024-05-17 13:02:57'),
    },
  });

  await prisma.sysRole.upsert({
    where: { roleId: 2 },
    update: {},
    create: {
      roleId: 2,
      roleName: '普通角色',
      roleKey: 'common',
      roleSort: 2,
      status: '0',
      dataScope: '2',
      delFlag: '0',
      deptCheckStrictly: true,
      menuCheckStrictly: true,
      remark: '普通用户角色',
      createBy: 'admin',
      createTime: new Date('2024-05-17 13:02:57'),
    },
  });

  console.log('✅ Roles seeded.');

  // ======================
  // 5. 创建用户 (SysUser)
  // ======================
  // 注意：password 应为加密后的值（如 bcrypt），此处为示意明文，实际应使用哈希
  const adminUser = await prisma.sysUser.upsert({
    where: { userId: 1 },
    update: {},
    create: {
      userId: 1,
      userName: 'admin',
      nickName: '系统管理员',
      password: '$2a$10$4K.85S6O3rG3u5Zv5Y9XqOZ6JZ6e6V8J5Z6e6V8J5Z6e6V8J5Z6e6', // bcrypt("admin123")
      email: 'admin@company.com',
      phonenumber: '13888888888',
      sex: '0',
      avatar: '',
      deptId: 100,
      status: '0',
      delFlag: '0',
      loginIp: '',
      loginDate: null,
      remark: '内置管理员',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:16'),
      updateBy: '',
      updateTime: null,
      userType: '00',
    },
  });

  const devUser = await prisma.sysUser.upsert({
    where: { userId: 2 },
    update: {},
    create: {
      userId: 2,
      userName: 'dev1',
      nickName: '研发员',
      password: '$2a$10$4K.85S6O3rG3u5Zv5Y9XqOZ6JZ6e6V8J5Z6e6V8J5Z6e6V8J5Z6e6', // bcrypt("dev123")
      email: 'dev1@company.com',
      phonenumber: '13999999999',
      sex: '0',
      avatar: '',
      deptId: 101,
      status: '0',
      delFlag: '0',
      loginIp: '',
      loginDate: null,
      remark: '研发部门员工',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:16'),
      updateBy: '',
      updateTime: null,
      userType: '00',
    },
  });

  console.log('✅ Users seeded.');

  // ======================
  // 6. 用户-角色关联
  // ======================
  // admin 用户拥有 roleId=1
  await prisma.sysUser.update({
    where: { userId: 1 },
    data: {
      roles: {
        connect: { roleId: 1 },
      },
    },
  });

  // dev1 用户拥有 roleId=2
  await prisma.sysUser.update({
    where: { userId: 2 },
    data: {
      roles: {
        connect: { roleId: 2 },
      },
    },
  });

  // 角色关联部门（可选）
  await prisma.sysRole.update({
    where: { roleId: 1 },
    data: {
      depts: {
        connect: [{ deptId: 100 }, { deptId: 101 }, { deptId: 102 }],
      },
    },
  });

  await prisma.sysRole.update({
    where: { roleId: 2 },
    data: {
      depts: {
        connect: { deptId: 101 },
      },
    },
  });

  console.log('✅ User-Role & Role-Dept relations connected.');

  // ======================
  // 7. 创建菜单 (SysMenu)
  // ======================
  const menuItems = [
    {
      menuId: 1,
      menuName: '系统管理',
      parentId: 0,
      orderNum: 1,
      path: 'system',
      component: null,
      isFrame: '1',
      isCache: '0',
      menuType: 'M',
      visible: '0',
      status: '0',
      perms: '',
      icon: 'system',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
    },
    {
      menuId: 100,
      menuName: '用户管理',
      parentId: 1,
      orderNum: 1,
      path: 'user',
      component: 'system/user/index',
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:user:list',
      icon: 'user',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
    },
    {
      menuId: 101,
      menuName: '角色管理',
      parentId: 1,
      orderNum: 2,
      path: 'role',
      component: 'system/role/index',
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:role:list',
      icon: 'peoples',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
    },
    {
      menuId: 102,
      menuName: '菜单管理',
      parentId: 1,
      orderNum: 3,
      path: 'menu',
      component: 'system/menu/index',
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:menu:list',
      icon: 'tree-table',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
    },
    {
      menuId: 103,
      menuName: '部门管理',
      parentId: 1,
      orderNum: 4,
      path: 'dept',
      component: 'system/dept/index',
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:dept:list',
      icon: 'tree',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
    },
    {
      menuId: 104,
      menuName: '岗位管理',
      parentId: 1,
      orderNum: 5,
      path: 'post',
      component: 'system/post/index',
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:post:list',
      icon: 'skill',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
    },
    {
      menuId: 105,
      menuName: '字典管理',
      parentId: 1,
      orderNum: 6,
      path: 'dict',
      component: 'system/dict/index',
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:dict:list',
      icon: 'dict',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
    },
    {
      menuId: 106,
      menuName: '参数设置',
      parentId: 1,
      orderNum: 7,
      path: 'config',
      component: 'system/config/index',
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:config:list',
      icon: 'edit',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
    },
    {
      menuId: 107,
      menuName: '通知公告',
      parentId: 1,
      orderNum: 8,
      path: 'notice',
      component: 'system/notice/index',
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'system:notice:list',
      icon: 'message',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
    },
    {
      menuId: 108,
      menuName: '日志管理',
      parentId: 1,
      orderNum: 9,
      path: 'log',
      component: null,
      isFrame: '1',
      isCache: '0',
      menuType: 'M',
      visible: '0',
      status: '0',
      perms: '',
      icon: 'log',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
    },
    {
      menuId: 500,
      menuName: '操作日志',
      parentId: 108,
      orderNum: 1,
      path: 'operlog',
      component: 'monitor/operlog/index',
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'monitor:operlog:list',
      icon: 'form',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
    },
    {
      menuId: 501,
      menuName: '登录日志',
      parentId: 108,
      orderNum: 2,
      path: 'logininfor',
      component: 'monitor/logininfor/index',
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'monitor:logininfor:list',
      icon: 'logininfor',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
    },
  ];

  for (const menu of menuItems) {
    await prisma.sysMenu.upsert({
      where: { menuId: menu.menuId },
      update: {},
      create: menu,
    });
  }

  // 角色-菜单关联
  await prisma.sysRole.update({
    where: { roleId: 1 },
    data: {
      menus: {
        connect: menuItems.map((m) => ({ menuId: m.menuId })),
      },
    },
  });

  console.log('✅ Menus and Role-Menu relations seeded.');

  // ======================
  // 8. 创建字典类型与数据
  // ======================
  const dictTypeSex = await prisma.sysDictType.upsert({
    where: { dictType: 'sys_user_sex' },
    update: {},
    create: {
      dictId: 1,
      dictName: '性别',
      dictType: 'sys_user_sex',
      status: '0',
      createBy: 'admin',
      createTime: new Date('2024-04-18 16:07:17'),
      remark: '用户性别列表',
    },
  });

  await prisma.sysDictData.createMany({
    data: [
      {
        dictCode: 1,
        dictLabel: '男',
        dictValue: '0',
        dictType: 'sys_user_sex',
        cssClass: '',
        listClass: 'primary',
        isDefault: 'Y',
        status: '0',
        createBy: 'admin',
        createTime: new Date('2024-04-18 16:07:17'),
      },
      {
        dictCode: 2,
        dictLabel: '女',
        dictValue: '1',
        dictType: 'sys_user_sex',
        cssClass: '',
        listClass: 'danger',
        isDefault: 'N',
        status: '0',
        createBy: 'admin',
        createTime: new Date('2024-04-18 16:07:17'),
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Dictionary data seeded.');

  // ======================
  // 9. 系统配置
  // ======================
  await prisma.sysConfig.createMany({
    data: [
      {
        configId: 1,
        configName: '主框架页-默认皮肤样式名称',
        configKey: 'sys.index.skinName',
        configValue: '蓝色',
        configType: 'Y',
        createBy: 'admin',
        createTime: new Date('2024-04-18 16:07:17'),
        remark:
          '蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow',
      },
      {
        configId: 2,
        configName: '用户管理-账号初始密码',
        configKey: 'sys.user.initPassword',
        configValue: 'admin123',
        configType: 'Y',
        createBy: 'admin',
        createTime: new Date('2024-04-18 16:07:17'),
        remark: '初始化密码',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Configs seeded.');

  // ======================
  // 10. 网站设置 (SysWeb)
  // ======================
  await prisma.sysWeb.upsert({
    where: { webId: 1 },
    update: {},
    create: {
      webId: 1,
      theme: '#409EFF',
      sideTheme: '',
      topNav: false,
      tagsView: true,
      fixedHeader: true,
      sidebarLogo: true,
      dynamicTitle: true,
      createBy: 'admin',
      createTime: new Date('2024-05-17 13:50:01'),
      userId: 1,
    },
  });

  console.log('✅ Web settings seeded.');

  // ======================
  // 11. 公告通知
  // ======================
  await prisma.sysNotice.create({
    data: {
      noticeId: 1,
      noticeTitle: '测试一个公告',
      noticeType: '1',
      noticeContent: Buffer.from('<p>测试一下公告...</p>', 'utf-8'),
      status: '0',
      createBy: 'admin',
      createTime: new Date('2024-05-17 13:50:01'),
    },
  });

  console.log('✅ Notice seeded.');

  console.log('🎉 All initial data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
