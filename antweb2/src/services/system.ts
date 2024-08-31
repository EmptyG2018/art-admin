import request from './_request';

// 获取系统配置
export async function getSystemConfig(options?: { [key: string]: any }) {
  return request<any>('/api/system/web', {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取菜单
export async function getSystemMenus(options?: { [key: string]: any }) {
  return request<any>('/api/getRouters', {
    method: 'GET',
    ...(options || {}),
  });
}
