// prisma/clear.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 显式中间表（必须用 raw 删除）
const explicitRelationTables = [
  '_sys_dept_to_sys_role',
  '_sys_menu_to_sys_role',
  '_sys_post_to_sys_user',
  '_sys_role_to_sys_user',
];

// ✅ 正确删除顺序：从“被引用者”开始删
const deletionOrder = [
  'SysWeb',        // 依赖 SysUser
  'SysUser',       // 被 Web、Role、Post 引用
  'SysRole',       // 被 Menu、Dept、User 引用
  'SysMenu',       // 被 Role 引用
  'SysDept',       // 被 User、Role 引用
  'SysPost',       // 被 User 引用
  'SysDictData',   // 依赖 DictType
  'SysDictType',   // 根
  'SysConfig',
  'SysJob',
  'SysJobLog',
  'SysLoginInfor',
  'SysOperLog',
  'SysNotice',
];

// PascalCase → camelCase
function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

async function clearDatabase() {
  console.log('🗑️ 开始清空数据库...');

  try {
    // ✅ Step 1: 先清空所有显式中间表（避免外键冲突）
    for (const table of explicitRelationTables) {
      await prisma.$executeRawUnsafe(`DELETE FROM \`${table}\`;`);
      console.log(`✅ 清空中间表: ${table}`);
    }

    // ✅ Step 2: 按正确顺序清空主表
    for (const modelName of deletionOrder) {
      const camelModelName = toCamelCase(modelName);
      const model = prisma[camelModelName];

      if (!model || typeof model.deleteMany !== 'function') {
        console.warn(`⚠️ 未找到模型: ${camelModelName}`);
        continue;
      }

      const result = await model.deleteMany({});
      console.log(`✅ 清空表 ${modelName}: 删除 ${result.count} 条记录`);
    }

    // ✅ Step 3: 清空迁移表（可选）
    await prisma.$executeRawUnsafe(`DELETE FROM \`_prisma_migrations\`;`);
    console.log('✅ 清空迁移表: _prisma_migrations');

    console.log('🎉 数据库已清空！');
  } catch (error) {
    console.error('❌ 清空失败:', error.message || error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();