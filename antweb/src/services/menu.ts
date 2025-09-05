import request from './_request';

// 查询角色分页列表
export const queryMenuList = (
  params: {
    // query
    /** menuName */
    menuName?: string;
    /** status */
    status?: string;
  },
  options?: { [key: string]: any },
) => {
  return request<API.MenuListResult>('/api/system/menu/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

export const queryMenuTree = () => {
  return request<any>('/api/system/menu/treeselect', {
    method: 'GET',
  });
};
