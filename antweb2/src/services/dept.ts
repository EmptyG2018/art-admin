import request from './_request';

// 查询部门树形列表
export const queryDeptTreeList = (options?: { [key: string]: any }) => {
  return request<API.UserPageResult>('/api/system/user/deptTree', {
    method: 'GET',
    ...(options || {}),
  });
};
