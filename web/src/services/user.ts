import request from './_request';

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

// 新增用户
export const addUser = (data: any) => {
  return request<any>('/api/system/user', {
    method: 'POST',
    data,
  });
};

// 修改用户
export const updateUser = (data: any) => {
  return request<any>('/api/system/user', {
    method: 'PUT',
    data,
  });
};

// 用户详情
export function getUser(userId: number) {
  return request<any>('/api/system/user/antd/' + userId, {
    method: 'GET',
  });
}

// 删除用户
export function deleteUser(userIds) {
  return request<any>('/api/system/user/' + userIds, {
    method: 'DELETE',
  });
}

// 重置用户密码
export function resetUserPwd(data: any) {
  return request<any>('/api/system/user/resetPwd', {
    method: 'PUT',
    data,
  });
}

// 获取未授权用户列表
export function getUnAllocatedUserList(params: any) {
  return request<any>('/api/system/role/authUser/unallocatedList', {
    method: 'GET',
    params,
  });
}

// 获取已授权用户列表
export function getAllocatedUserList(params: any) {
  return request<any>('/api/system/role/authUser/allocatedList', {
    method: 'GET',
    params,
  });
}
