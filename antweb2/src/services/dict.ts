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

export const queryDictsByType = (dictType: string) => {
  return request(`/api/system/dict/data/type/${dictType}`, {
    method: 'GET',
  });
};

/**新增字典 */
export const addDictType = (data) => {
  return request(`/api/system/dict/type`, {
    method: 'POST',
    data,
  });
};

/**删除字典  */
export const deleteDictType = (dictIds) => {
  return request(`/api/system/dict/type/${dictIds}`, {
    method: 'DELETE',
  });
};

/**修改字典 */
export const updateDictType = (data) => {
  return request(`/api/system/dict/type`, {
    method: 'PUT',
    data,
  });
};

/**字典详情 */
export const getDictType = (dictId) => {
  return request(`/api/system/dict/type/${dictId}`, {
    method: 'GET',
  });
};

/**查询字典键值列表 */
export const queryDictPage = (
  params: {
    // query
    /** dictLabel */
    dictLabl?: string;
    /** dictType */
    dictType?: string;
    /** status */
    status?: string;
  },
  options?: { [key: string]: any },
) => {
  return request<API.DictTypePageResult>('/api/system/dict/data/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

/**新增字典 */
export const addDict = (data) => {
  return request(`/api/system/dict/data`, {
    method: 'POST',
    data,
  });
};

/**删除字典  */
export const deleteDict = (dictIds) => {
  return request(`/api/system/dict/data/${dictIds}`, {
    method: 'DELETE',
  });
};

/**修改字典 */
export const updateDict = (data) => {
  return request(`/api/system/dict/data`, {
    method: 'PUT',
    data,
  });
};

/**字典详情 */
export const getDict = (dictId) => {
  return request(`/api/system/dict/data/${dictId}`, {
    method: 'GET',
  });
};
