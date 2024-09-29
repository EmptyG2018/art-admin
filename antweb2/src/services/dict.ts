import request from './_request';

// 查询字典类型列表
export const queryDictTypePage = (
  params: {
    // query
    /** dictName */
    dictName?: string;
    /** dictType */
    dictType?: string;
    /** status */
    status?: string;
    /** beginTime */
    beginTime?: string;
    /** endTime */
    endTime?: string;
  },
  options?: { [key: string]: any },
) => {
  return request<API.DictTypePageResult>('/api/system/dict/type/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};
