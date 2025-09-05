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

// 查询所有岗位
export const queryAllPost = () => {
  return request('/api/system/post/all', {
    method: 'GET',
  });
};

// 新增岗位
export const addPost = (data) => {
  return request('/api/system/post', {
    method: 'POST',
    data,
  });
};

// 删除岗位
export const deletePost = (postIds) => {
  return request('/api/system/post/' + postIds, {
    method: 'DELETE',
  });
};

// 修改岗位
export const updatePost = (data) => {
  return request('/api/system/post', {
    method: 'PUT',
    data,
  });
};

// 岗位详情
export const getPost = (postId) => {
  return request('/api/system/post/' + postId, {
    method: 'GET',
  });
};
