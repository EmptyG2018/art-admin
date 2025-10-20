import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { useT, T } from '@/locales';
import { addDept } from '@/services/dept';

interface CreateDeptFormProps {
  trigger: JSX.Element;
  values?: any;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const CreateDeptForm: React.FC<CreateDeptFormProps> = (props) => {
  const t = useT();
  const { message } = App.useApp();
  const { trigger, values, formRender, onFinish } = props;

  return (
    <EditFormModal
      title={
        <T
          id="component.form.add"
          values={{ title: <T id="page.dept.title" /> }}
        />
      }
      values={values}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading(t('component.form.message.add.loading'));
        try {
          await addDept(formValues);
          onFinish?.();
          hide();
          message.success(t('component.form.message.add.success'));
          return true;
        } catch {
          hide();
          message.success(t('component.form.message.add.error'));
          return false;
        }
      }}
    />
  );
};

export default CreateDeptForm;
