import { request } from '@umijs/max';

// 获取图形验证码
export async function queryCaptchaImage(options?: { [key: string]: any }) {
  return request<any>('/api/captchaImage', {
    method: 'GET',
    ...(options || {}),
  });
}
