import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { useT, T } from '@/locales';
import { getRoleDept } from '@/services/dept';
import { updateDataScope, getRole } from '@/services/role';

interface UpdateRoleFormProps {
  values?: any;
  trigger: JSX.Element;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const UpdateRoleForm: React.FC<UpdateRoleFormProps> = (props) => {
  const t = useT();
  const { message } = App.useApp();
  const { values, trigger, formRender, onFinish } = props;

  return (
    <EditFormModal
      title={<T id="page.role.permissionData" />}
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
        const hide = message.loading(
          t('component.form.message.update.loading'),
        );
        try {
          await updateDataScope({
            ...values,
            ...formValues,
            deptIds: dataScope !== '2' ? [] : deptIds,
          });
          onFinish?.();
          hide();
          message.success(t('component.form.message.update.success'));
          return true;
        } catch {
          hide();
          message.success(t('component.form.message.update.error'));
          return false;
        }
      }}
    />
  );
};

export default UpdateRoleForm;
