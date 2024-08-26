import { request } from '@umijs/max';

// 获取图形验证码
export async function queryCaptchaImage(options?: { [key: string]: any }) {
  return request<any>('/captchaImage', {
    method: 'GET',
    ...(options || {}),
  });
}
