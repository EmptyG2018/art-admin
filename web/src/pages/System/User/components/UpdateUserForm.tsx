import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { getUser, updateUser } from '@/services/user';

interface UpdateUserFormProps {
  formReaonly?: boolean;
  values?: any;
  trigger: JSX.Element;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = (props) => {
  const { message } = App.useApp();
  const { formReaonly, values, trigger, formRender, onFinish } = props;

  return (
    <EditFormModal
      title={formReaonly ? '查看用户' : '修改用户'}
      request={async () => {
        const res = await getUser(values.userId);
        return res.data;
      }}
      trigger={trigger}
      formRender={formRender}
      formProps={{
        readonly: formReaonly,
      }}
      onFinish={async (formValues) => {
        const hide = message.loading('正在修改');
        try {
          await updateUser({ ...values, ...formValues });
          onFinish?.();
          hide();
          message.success('添加修改');
          return true;
        } catch {
          hide();
          message.error('添加修改请重试！');
          return false;
        }
      }}
    />
  );
};

export default UpdateUserForm;
