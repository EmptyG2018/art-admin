import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { useT } from '@/locales';
import { addUser } from '@/services/user';

interface CreateUserFormProps {
  values?: any;
  trigger: JSX.Element;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = (props) => {
  const t = useT();
  const { message } = App.useApp();
  const { values, trigger, formRender, onFinish } = props;

  return (
    <EditFormModal
      title="新建用户"
      values={values}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading(t('component.form.message.add.loading'));
        try {
          await addUser(formValues);
          onFinish?.();
          hide();
          message.success(t('component.form.message.add.success'));
          return true;
        } catch {
          hide();
          message.error(t('component.form.message.add.error'));
          return false;
        }
      }}
    />
  );
};

export default CreateUserForm;
