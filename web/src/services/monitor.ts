import request from './_request';

// 查询在线用户分页列表
export const queryOnlinePage = (
  params: PageField & {
    // query
    /** ipaddr */
    ipaddr?: string;
    /** userName */
    userName?: string;
    /** beginTime */
    beginTime?: string;
    /** endTime */
    endTime?: string;
  },
  options?: { [key: string]: any },
) => {
  return request<API.PostPageResult>('/api/monitor/online/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

// 强退在线用户
export const deleteOnline = (tokenId) => {
  return request('/api/monitor/online/' + tokenId, {
    method: 'DELETE',
  });
};

// 查询定时任务列表
export const queryJobPage = (
  params: PageField & {
    // query
    /** jobName */
    jobName?: string;
    /** jobGroup */
    jobGroup?: string;
    /** status */
    status?: string;
  },
  options?: { [key: string]: any },
) => {
  return request<API.PostPageResult>('/api/monitor/job/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

// 新增定时任务
export const addJob = (data) => {
  return request('/api/monitor/job', {
    method: 'POST',
    data,
  });
};

// 删除定时任务
export const deleteJob = (jobId) => {
  return request('/api/monitor/job/' + jobId, {
    method: 'DELETE',
  });
};

// 修改定时任务
export const updateJob = (data) => {
  return request('/api/monitor/job', {
    method: 'PUT',
    data,
  });
};

// 定时任务详情
export const getJob = (jobId) => {
  return request('/api/monitor/job/' + jobId, {
    method: 'GET',
  });
};

// 执行定时任务
export const runJob = (data) => {
  return request('/api/monitor/job/run', {
    method: 'PUT',
    data,
  });
};

// 查询调度日志列表
export const queryJobLogPage = (
  params: PageField & {
    // query
    /** jobName */
    jobName?: string;
    /** jobGroup */
    jobGroup?: string;
    /** status */
    status?: string;
    /** beginTime */
    beginTime?: string;
    /** endTime */
    endTime?: string;
  },
  options?: { [key: string]: any },
) => {
  return request<API.PostPageResult>('/api/monitor/jobLog/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

// 清空调度日志
export const cleanJobLog = () => {
  return request('/api/monitor/jobLog/clean', {
    method: 'DELETE',
  });
};

// 查询服务状态
export const queryServerInfo = () => {
  return request('/api/monitor/server', {
    method: 'GET',
  });
};

// 查询缓存信息
export const queryCacheInfo = () => {
  return request('/api/monitor/cache', {
    method: 'GET',
  });
};

// 查询缓存列表
export const queryCacheList = (params) => {
  return request('/api/monitor/cache/getNames', {
    method: 'GET',
    params,
  });
};

// 查询缓存键名列表
export const queryCacheKeyList = (cacheName) => {
  return request('/api/monitor/cache/getKeys/' + cacheName, {
    method: 'GET',
  });
};

// 查询缓存键值
export const queryCacheValue = (cacheName, cacheKey) => {
  return request('/api/monitor/cache/getValue/' + cacheName + '/' + cacheKey, {
    method: 'GET',
  });
};

// 删除缓存名称
export const deleteCacheName = (cacheName) => {
  return request('/api/monitor/cache/deleteCacheName/' + cacheName, {
    method: 'DELETE',
  });
};

// 删除缓存键名
export const deleteCacheKey = (cacheKey) => {
  return request('/api/monitor/cache/deleteCacheKey/' + cacheKey, {
    method: 'DELETE',
  });
};

// 清空缓存
export const cleanCache = () => {
  return request('/api/monitor/cache/clearCacheAll', {
    method: 'DELETE',
  });
};
