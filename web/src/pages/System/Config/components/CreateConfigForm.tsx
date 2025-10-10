import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { addConfig } from '@/services/config';

interface CreateConfigFormProps {
  trigger: JSX.Element;
  values?: any;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const CreateConfigForm: React.FC<CreateConfigFormProps> = (props) => {
  const { message } = App.useApp();
  const { trigger, values, formRender, onFinish } = props;

  return (
    <EditFormModal
      title="新增参数"
      values={values}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading('正在添加');
        try {
          await addConfig(formValues);
          onFinish?.();
          hide();
          message.success('添加成功');
          return true;
        } catch {
          hide();
          message.error('添加失败请重试！');
          return false;
        }
      }}
    />
  );
};

export default CreateConfigForm;
