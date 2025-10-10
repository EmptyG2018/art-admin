import React, { useState } from 'react';
import { Modal } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';

interface EditOperlogWrapperForm {
  values?: any;
}

interface EditOperlogForm extends EditOperlogWrapperForm {
  trigger: JSX.Element;
}

const EditOperlogWrapperForm: React.FC<EditOperlogWrapperForm> = (props) => {
  const { values } = props;

  return (
    <ProDescriptions layout="vertical" column={2}>
      <ProDescriptions.Item label="操作模块" valueType="text" span={2}>
        {values.title}
      </ProDescriptions.Item>
      <ProDescriptions.Item label="登录信息" valueType="text" span={2}>
        {values.operName} / {values.operIp} ({values.operLocation})
      </ProDescriptions.Item>
      <ProDescriptions.Item label="请求地址" valueType="text">
        {values.operUrl}
      </ProDescriptions.Item>
      <ProDescriptions.Item label="请求方式" valueType="text">
        {values.requestMethod}
      </ProDescriptions.Item>
      <ProDescriptions.Item label="操作方式" valueType="text">
        {values.method}
      </ProDescriptions.Item>
      <ProDescriptions.Item
        label="操作状态"
        valueType="radio"
        request={async () => {
          const res = await queryDictsByType('sys_common_status');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
      >
        {values.status}
      </ProDescriptions.Item>
      <ProDescriptions.Item label="请求参数" valueType="jsonCode">
        {values.operParam}
      </ProDescriptions.Item>
      <ProDescriptions.Item label="响应结果" valueType="jsonCode">
        {values.jsonResult}
      </ProDescriptions.Item>
      <ProDescriptions.Item label="耗时(ms)" valueType="digit">
        {values.costTime}
      </ProDescriptions.Item>
    </ProDescriptions>
  );
};

const EditOperlogForm: React.FC<EditOperlogForm> = (props) => {
  const { trigger, ...rest } = props;
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      {React.cloneElement(trigger, {
        onClick: () => setVisible(true),
      })}
      <Modal
        open={visible}
        title="查看操作日志"
        width={800}
        footer={null}
        destroyOnHidden
        onCancel={() => setVisible(false)}
      >
        <EditOperlogWrapperForm {...rest} />
      </Modal>
    </>
  );
};

export default EditOperlogForm;
