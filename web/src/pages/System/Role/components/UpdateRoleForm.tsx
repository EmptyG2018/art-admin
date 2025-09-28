import React from 'react';
import { App } from 'antd';
import EditRoleForm from './EditRoleForm';
import { updateRole, getRole } from '@/services/role';

interface UpdateRoleFormProps {
  values?: any;
  trigger: JSX.Element;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const UpdateRoleForm: React.FC<UpdateRoleFormProps> = (props) => {
  const { message } = App.useApp();
  const { values, trigger, formRender, onFinish } = props;

  return (
    <EditRoleForm
      title="修改角色"
      request={async () => {
        const res = await getRole(values.roleId);
        return res.data;
      }}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading('正在修改');
        try {
          await updateRole({ ...values, ...formValues });
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

export default UpdateRoleForm;
