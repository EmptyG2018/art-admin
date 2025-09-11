import React from 'react';
import { App } from 'antd';
import EditMenuForm from './EditMenuForm';
import { updateMenu, getMenu } from '@/services/menu';

interface UpdateMenuFormProps {
  values?: any;
  trigger: JSX.Element;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const UpdateMenuForm: React.FC<UpdateMenuFormProps> = (props) => {
  const { message } = App.useApp();
  const { values, trigger, formRender, onFinish } = props;

  return (
    <EditMenuForm
      title="修改菜单"
      request={async () => {
        const res = await getMenu(values.menuId);
        return res.data;
      }}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading('正在添加');
        try {
          await updateMenu({ ...values, ...formValues });
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

export default UpdateMenuForm;
