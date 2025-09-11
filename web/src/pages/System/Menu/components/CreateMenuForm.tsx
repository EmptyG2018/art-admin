import React from 'react';
import { App } from 'antd';
import EditMenuForm from './EditMenuForm';
import { addMenu } from '@/services/menu';

interface CreateMenuFormProps {
  values?: any;
  trigger: JSX.Element;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const CreateMenuForm: React.FC<CreateMenuFormProps> = (props) => {
  const { message } = App.useApp();
  const { values, trigger, formRender, onFinish } = props;

  return (
    <EditMenuForm
      title="新建菜单"
      values={values}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading('正在添加');
        try {
          await addMenu(formValues);
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

export default CreateMenuForm;
