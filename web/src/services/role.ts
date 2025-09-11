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
}