import React, { useState } from 'react';
import { Modal } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import { rawT, useT, T } from '@/locales';
import { queryDictsByType } from '@/services/dict';

interface ViewOperlogWrapperForm {
  values?: any;
}

interface ViewOperlogForm extends ViewOperlogWrapperForm {
  trigger: JSX.Element;
}

const ViewOperlogWrapperForm: React.FC<ViewOperlogWrapperForm> = (props) => {
  const t = useT();
  const { values } = props;

  return (
    <ProDescriptions layout="vertical" column={2}>
      <ProDescriptions.Item
        label={<T id="page.operlog.field.operModule" />}
        valueType="text"
        span={2}
      >
        {values.title}
      </ProDescriptions.Item>
      <ProDescriptions.Item
        label={<T id="page.operlog.field.loginInfo" />}
        valueType="text"
        span={2}
      >
        {values.operName} / {values.operIp} ({values.operLocation})
      </ProDescriptions.Item>
      <ProDescriptions.Item
        label={<T id="page.operlog.field.url" />}
        valueType="text"
      >
        {values.operUrl}
      </ProDescriptions.Item>
      <ProDescriptions.Item
        label={<T id="page.operlog.field.reqMethod" />}
        valueType="text"
      >
        {values.requestMethod}
      </ProDescriptions.Item>
      <ProDescriptions.Item
        label={<T id="page.operlog.field.operMethod" />}
        valueType="text"
      >
        {values.method}
      </ProDescriptions.Item>
      <ProDescriptions.Item
        label={<T id="page.operlog.field.operStatus" />}
        valueType="radio"
        request={async () => {
          const res = await queryDictsByType('sys_common_status');
          return res.data.map((dict) => ({
            label: dict.i18nKey ? t(dict.i18nKey) : dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
      >
        {values.status}
      </ProDescriptions.Item>
      <ProDescriptions.Item
        label={<T id="page.operlog.field.req" />}
        valueType="jsonCode"
      >
        {values.operParam}
      </ProDescriptions.Item>
      <ProDescriptions.Item
        label={<T id="page.operlog.field.res" />}
        valueType="jsonCode"
      >
        {values.jsonResult}
      </ProDescriptions.Item>
      <ProDescriptions.Item
        label={<T id="page.operlog.field.timer" />}
        valueType="digit"
      >
        {values.costTime}
      </ProDescriptions.Item>
    </ProDescriptions>
  );
};

const ViewOperlogForm: React.FC<ViewOperlogForm> = (props) => {
  const { trigger, ...rest } = props;
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      {React.cloneElement(trigger, {
        onClick: () => setVisible(true),
      })}
      <Modal
        open={visible}
        title={
          <T
            id="component.form.view"
            values={{ title: <T id="page.operlog.title" /> }}
          />
        }
        width={800}
        footer={null}
        destroyOnHidden
        onCancel={() => setVisible(false)}
      >
        <ViewOperlogWrapperForm {...rest} />
      </Modal>
    </>
  );
};

export default ViewOperlogForm;
