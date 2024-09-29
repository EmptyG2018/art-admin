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

// 查询用户分页列表
export const queryUserPage = (
  params: PageField & {
    // query
    /** userName */
    userName?: string;
    /** phonenumber */
    phonenumber?: string;
    /** deptId */
    deptId?: string;
    /** status */
    status?: string;
    /** beginTime */
    beginTime?: string;
    /** endTime */
    endTime?: string;
  },
  options?: { [key: string]: any },
) => {
  return request<API.UserPageResult>('/api/system/user/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};
