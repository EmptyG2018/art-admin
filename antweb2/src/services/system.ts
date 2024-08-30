import request from './_request';

// 获取系统配置
export async function getSystemConfig(options?: { [key: string]: any }) {
  return request<API.LoginAccountResult>('/system/web', {
    method: 'GET',
    headers: {
      public: true,
    },
    ...(options || {}),
  });
}

// 获取菜单
export async function getMenus(options?: { [key: string]: any }) {
  return request<API.LoginAccountResult>('/getRouters', {
    method: 'GET',
    headers: {
      public: true,
    },
    ...(options || {}),
  });
}
