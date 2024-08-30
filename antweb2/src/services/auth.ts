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
