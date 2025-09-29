import request from './_request';

// 查询部门树形列表
export const queryDeptTree = (params?: any, options?: { [key: string]: any }) => {
  return request<API.DeptTreeListResult>('/api/system/dept/tree', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

// 查询部门列表
export const queryDeptList = (params, options?: { [key: string]: any }) => {
  return request<API.DeptListResult>('/api/system/dept/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

// 新增部门
export const addDept = (data) => {
  return request<any>('/api/system/dept', {
    method: 'POST',
    data,
  });
};

// 删除部门
export const deleteDept = (deptId) => {
  return request<any>('/api/system/dept/' + deptId, {
    method: 'DELETE',
  });
};

// 修改部门
export const updateDept = (data) => {
  return request<any>('/api/system/dept', {
    method: 'PUT',
    data,
  });
};

// 部门详情
export const getDept = (deptId) => {
  return request<any>('/api/system/dept/' + deptId, {
    method: 'GET',
  });
};


// 获取角色选中的部门
export const getRoleDept = (roleId) => {
  return request('/api/system/dept/roleDept/' + roleId, {
    method: 'GET',
  });
};