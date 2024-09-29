import request from './_request';

// 查询部门树形列表
export const queryDeptTreeList = (options?: { [key: string]: any }) => {
  return request<API.DeptTreeListResult>('/api/system/user/deptTree', {
    method: 'GET',
    ...(options || {}),
  });
};

// 查询部门列表
export const queryDeptList = (options?: { [key: string]: any }) => {
  return request<API.DeptListResult>('/api/system/dept/list', {
    method: 'GET',
    ...(options || {}),
  });
};
