import request from './_request';

// 获取图形验证码
export async function queryCaptchaImage(options?: { [key: string]: any }) {
  return request<API.CaptchaImageResult>('/api/captchaImage', {
    method: 'GET',
    headers: {
      public: true,
    },
    ...(options || {}),
  });
}

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
  return request<API.LoginAccountResult>('/api/login', {
    method: 'POST',
    headers: {
      public: true,
    },
    data: body,
    ...(options || {}),
  });
}

// 用户信息
export async function getUserInfo(options?: { [key: string]: any }) {
  return request<API.UserInfoResult>('/api/getInfo', {
    method: 'GET',
    ...(options || {}),
  });
}
