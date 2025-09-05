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
