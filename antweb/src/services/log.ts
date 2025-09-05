import request from './_request';

// 查询操作日志分页列表
export const queryOperlogPage = (
  params: PageField & {
    // query
    /** operIp */
    operIp?: string;
    /** title */
    title?: string;
    /** operName */
    operName?: string;
    /** businessType */
    businessType?: string;
    /** status */
    status?: string;
    /** beginTime */
    beginTime?: string;
    /** endTime */
    endTime?: string;
  },
  options?: { [key: string]: any },
) => {
  return request<API.PostPageResult>('/api/monitor/operlog/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

// 删除操作日志
export const deleteOperlog = (operIds) => {
  return request('/api/monitor/operlog/' + operIds, {
    method: 'DELETE',
  });
};

// 清空操作日志
export const cleanOperlog = () => {
  return request('/api/monitor/operlog/clean', {
    method: 'DELETE',
  });
};

// 查询登录日志分页列表
export const queryLogininforPage = (
  params: PageField & {
    // query
    /** ipaddr */
    ipaddr?: string;
    /** userName */
    userName?: string;
    /** status */
    status?: string;
    /** beginTime */
    beginTime?: string;
    /** endTime */
    endTime?: string;
  },
  options?: { [key: string]: any },
) => {
  return request<API.PostPageResult>('/api/monitor/logininfor/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

// 删除登录日志
export const deleteLogininfor = (infoIds) => {
  return request('/api/monitor/logininfor/' + infoIds, {
    method: 'DELETE',
  });
};

// 清空登录日志
export const cleanLogininfor = () => {
  return request('/api/monitor/logininfor/clean', {
    method: 'DELETE',
  });
};
