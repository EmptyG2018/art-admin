import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { useT, T } from '@/locales';
import { getUser, updateUser } from '@/services/user';

interface UpdateUserFormProps {
  formReaonly?: boolean;
  values?: any;
  trigger: JSX.Element;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = (props) => {
  const t = useT();
  const { message } = App.useApp();
  const { formReaonly, values, trigger, formRender, onFinish } = props;

  return (
    <EditFormModal
      title={
        formReaonly ? (
          <T
            id="component.form.view"
            values={{ title: <T id="page.user.title" /> }}
          />
        ) : (
          <T
            id="component.form.update"
            values={{ title: <T id="page.user.title" /> }}
          />
        )
      }
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
        const hide = message.loading(
          t('component.form.message.update.loading'),
        );
        try {
          await updateUser({ ...values, ...formValues });
          onFinish?.();
          hide();
          message.success(t('component.form.message.update.success'));
          return true;
        } catch {
          hide();
          message.error(t('component.form.message.update.error'));
          return false;
        }
      }}
    />
  );
};

export default UpdateUserForm;
