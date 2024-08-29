import storage from 'store';
import axios from 'axios';
import { message } from 'antd';

const resMap = {
  json: (response) => {
    response.use(
      async (response) => {
        if (response.status === 200 && response.data?.code === 200)
          return response.data.result;
        return Promise.reject(response?.data);
      },
      (error) => {
        if (error.response.status === 401) {
          setTimeout(() => {
            storage.remove('token');
            location.href = '/login';
          }, 1000);
          message.error({
            key: 'system',
            content: error.response.data.message,
          });
        } else {
          message.error({
            key: 'system',
            content: error.response.message,
          });
        }

        return Promise.reject({
          code: error.response.status,
          message: error.message,
        });
      },
    );
  },
  download: (response) => {
    response.use(
      async (response) => {
        if (response.status === 200) return response.data;
        return Promise.reject(response?.data);
      },
      (error) => {
        return Promise.reject({
          code: error.response.status,
          message: '下载失败',
        });
      },
    );
  },
};

const carryMap = {
  auth: (config) => {
    config.headers['Accesstoken'] = storage.get('token') || '';
  },
  site: (config) => {
    config.headers['Proxytoken'] = storage.get('agent')?.id;
  },
};

const request = (axiosOption, option = {}) => {
  const defaultResponseDataType = 'json';
  const { responseDataType = defaultResponseDataType, carry = [] } = option;

  const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });

  instance.interceptors.request.use((config) => {
    carry.forEach((item) => carryMap[item] && carryMap[item](config));
    return config;
  });

  resMap[responseDataType]
    ? resMap[responseDataType](instance.interceptors.response)
    : resMap[defaultResponseDataType](instance.interceptors.response);
  return instance(axiosOption);
};

export default request;
