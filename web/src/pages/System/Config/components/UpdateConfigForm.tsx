import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { updateConfig, getConfig } from '@/services/config';

interface UpdateConfigFormProps {
  trigger: JSX.Element;
  values: any;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const UpdateConfigForm: React.FC<UpdateConfigFormProps> = (props) => {
  const { message } = App.useApp();
  const { trigger, values, formRender, onFinish } = props;

  return (
    <EditFormModal
      title="修改参数"
      request={async () => {
        const res = await getConfig(values.configId);
        return res.data;
      }}
      trigger={trigger}
      formRender={formRender}
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
