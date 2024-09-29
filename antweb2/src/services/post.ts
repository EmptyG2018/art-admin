import request from './_request';

// 查询岗位分页列表
export const queryPostPage = (
  params: PageField & {
    // query
    /** postCode */
    postCode?: string;
    /** postName */
    postName?: string;
    /** status */
    status?: string;
    /** beginTime */
    beginTime?: string;
    /** endTime */
    endTime?: string;
  },
  options?: { [key: string]: any },
) => {
  return request<API.PostPageResult>('/api/system/post/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};
