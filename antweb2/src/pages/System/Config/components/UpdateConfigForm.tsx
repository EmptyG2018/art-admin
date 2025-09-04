import React, { PropsWithChildren } from 'react';
import { App } from 'antd';
import { ProColumns } from '@ant-design/pro-components';
import EditConfigForm from './EditConfigForm';
import { updateConfig, getConfig } from '@/services/config';

interface UpdateConfigFormProps {
  trigger: JSX.Element;
  values: any;
  columns: ProColumns[];
  onFinish?: () => void;
}

const UpdateConfigForm: React.FC<PropsWithChildren<UpdateConfigFormProps>> = (
  props,
) => {
  const { message } = App.useApp();
  const { trigger, values, columns, onFinish } = props;

  return (
    <EditConfigForm
      title="修改参数"
      request={async () => {
        const res = await getConfig(values.configId);
        return res.data;
      }}
      trigger={trigger}
      columns={columns}
      onFinish={async (formValues) => {
        const hide = message.loading('正在修改');
        try {
          await updateConfig({ ...values, ...formValues });
          onFinish?.();
          hide();
          message.success('修改成功');
          return true;
        } catch {
          hide();
          message.error('修改失败请重试！');
          return false;
        }
      }}
    />
  );
};

export default UpdateConfigForm;
