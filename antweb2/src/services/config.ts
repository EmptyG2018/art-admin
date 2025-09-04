import request from './_request';

// 查询参数列表
export const queryConfigPage = (params, options?: { [key: string]: any }) => {
  return request<API.ConfigListResult>('/api/system/config/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

// 新增参数
export const addConfig = (data) => {
  return request<any>('/api/system/config', {
    method: 'POST',
    data,
  });
};

// 删除参数
export const deleteConfig = (configId) => {
  return request<any>('/api/system/config/' + configId, {
    method: 'DELETE',
  });
};

// 修改参数
export const updateConfig = (data) => {
  return request<any>('/api/system/config', {
    method: 'PUT',
    data,
  });
};

// 参数详情
export const getConfig = (configId) => {
  return request<any>('/api/system/config/' + configId, {
    method: 'GET',
  });
};

