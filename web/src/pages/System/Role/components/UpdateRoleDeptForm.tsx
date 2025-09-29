import React from 'react';
import { App } from 'antd';
import EditRoleForm from './EditRoleForm';
import { getRoleDept } from '@/services/dept';
import { updateDataScope, getRole } from '@/services/role';

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
      title="分配数据权限"
      request={async () => {
        const res = await getRole(values.roleId);
        const res2 = await getRoleDept(values.roleId);
        return {
          ...res.data,
          deptIds: res2.data,
        };
      }}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const { dataScope, deptIds } = formValues;
        const hide = message.loading('正在修改');
        try {
          await updateDataScope({
            ...values,
            ...formValues,
            deptIds: dataScope !== '2' ? [] : deptIds,
          });
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

export default UpdateRoleForm;
