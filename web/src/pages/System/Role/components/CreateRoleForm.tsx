import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { addRole } from '@/services/role';

interface CreateRoleFormProps {
  values?: any;
  trigger: JSX.Element;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = (props) => {
  const { message } = App.useApp();
  const { values, trigger, formRender, onFinish } = props;

  return (
    <EditFormModal
      title="新建角色"
      values={values}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading('正在添加');
        try {
          await addRole(formValues);
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

export default CreateRoleForm;
