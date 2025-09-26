import request from './_request';

// 获取系统配置
export async function getSystemConfig(options?: { [key: string]: any }) {
  return request<any>('/api/system/web', {
    method: 'GET',
    ...(options || {}),
  });
}

// 修改系统配置
export async function updateSystemConfig(data) {
  return request<any>('/api/system/web', {
    method: 'POST',
    data,
  });
}

// 获取菜单
export async function getSystemMenus(options?: { [key: string]: any }) {
  return request<any>('/api/getRouters', {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取用户信息
export async function getProfile(options?: { [key: string]: any }) {
  return request<any>('/api/system/user/profile', {
    method: 'GET',
    ...(options || {}),
  });
}

// 修改用户信息
export async function updateProfile(data) {
  return request<any>('/api/system/user/profile', {
    method: 'PUT',
    data,
  });
}

// 修改用户密码
export async function updatePwd({ oldPassword, newPassword }) {
  return request<any>(
    '/api/system/user/profile/updatePwd?oldPassword=' +
      oldPassword +
      '&newPassword=' +
      newPassword,
    {
      method: 'PUT',
    },
  );
}
