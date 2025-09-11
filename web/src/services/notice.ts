import request from './_request';

// 查询公告分页列表
export const queryNoticePage = (
  params: PageField & {
    // query
    /** noticeTitle */
    noticeTitle?: string;
    /** createBy */
    createBy?: string;
    /** noticeType */
    noticeType?: string;
  },
  options?: { [key: string]: any },
) => {
  return request<API.PostPageResult>('/api/system/notice/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

// 新增公告
export const addNotice = (data) => {
  return request('/api/system/notice', {
    method: 'POST',
    data,
  });
};

// 删除公告
export const deleteNotice = (noticeIds) => {
  return request('/api/system/notice/' + noticeIds, {
    method: 'DELETE',
  });
};

// 修改公告
export const updateNotice = (data) => {
  return request('/api/system/notice', {
    method: 'PUT',
    data,
  });
};

// 公告详情
export const getNotice = (noticeId) => {
  return request('/api/system/notice/' + noticeId, {
    method: 'GET',
  });
};
