import request from './_request';

// 查询角色分页列表
export const queryRolePage = (
  params: PageField & {
    // query
    /** roleName */
    roleName?: string;
    /** roleKey */
    roleKey?: string;
    /** status */
    status?: string;
    /** beginTime */
    beginTime?: string;
    /** endTime */
    endTime?: string;
  },
  options?: { [key: string]: any },
) => {
  return request<API.RolePageResult>('/api/system/role/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

// 查询所有角色
export const queryAllRole = () => {
  return request('/api/system/role/all', {
    method: 'GET',
  });
};

// 新增角色
export const addRole = (data) => {
  return request('/api/system/role', {
    method: 'POST',
    data,
  });
};

// 删除角色
export const deleteRole = (roleIds) => {
  return request<any>('/api/system/role/' + roleIds, {
    method: 'DELETE',
  });
};

// 修改角色
export const updateRole = (data) => {
  return request('/api/system/role', {
    method: 'PUT',
    data,
  });
};

// 角色详情
export const getRole = (roleId) => {
  return request('/api/system/role/' + roleId, {
    method: 'GET',
  });
};

// 数据权限
export const updateDataScope = (data) => {
  return request('/api/system/role/dataScope', {
    method: 'PUT',
    data,
  });
};
