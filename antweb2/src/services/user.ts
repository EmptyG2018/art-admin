import request from './_request';

// 账号登录
export async function loginForAccount(
  body: {
    uuid: string;
    username: string;
    password: string;
    code: string;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/api/login', {
    method: 'POST',
    headers: {
      public: true,
    },
    data: body,
    ...(options || {}),
  });
}

// 用户信息
export async function getInfo(options?: { [key: string]: any }) {
  return request<any>('/api/getInfo', {
    method: 'GET',
    ...(options || {}),
  });
}
