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

// 新增菜单
export const addMenu = (data) => {
  return request<any>('/api/system/menu', {
    method: 'POST',
    data,
  });
};

// 删除菜单
export const deleteMenu = (menuIds) => {
  return request<any>('/api/system/menu/' + menuIds, {
    method: 'DELETE',
  });
};

// 修改菜单
export const updateMenu = (data) => {
  return request<any>('/api/system/menu', {
    method: 'PUT',
    data,
  });
};

// 菜单详情
export const getMenu = (menuId) => {
  return request<any>('/api/system/menu/' + menuId, {
    method: 'GET',
  });
};

// 获取角色选中的菜单
export const getRoleMenu = (roleId) => {
  return request('/api/system/menu/roleMenu/' + roleId, {
    method: 'GET',
  });
};