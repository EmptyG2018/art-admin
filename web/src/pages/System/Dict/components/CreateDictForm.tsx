import React from 'react';
import { App } from 'antd';
import {EditFormModal} from '@/components';
import { addDictType } from '@/services/dict';

interface CreateFormProps {
  trigger: JSX.Element;
  values?: any;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const CreateDictForm: React.FC<CreateFormProps> = (
  props,
) => {
  const { message } = App.useApp();
  const { trigger, values, formRender, onFinish } = props;

  return (
    <EditFormModal
      title="新增岗位"
      values={values}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading('正在添加');
        try {
          await addDictType(formValues);
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

export default CreateDictForm;

