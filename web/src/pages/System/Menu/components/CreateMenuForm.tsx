import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { useT, T } from '@/locales';
import { addMenu } from '@/services/menu';

interface CreateMenuFormProps {
  values?: any;
  trigger: JSX.Element;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const CreateMenuForm: React.FC<CreateMenuFormProps> = (props) => {
  const t = useT();
  const { message } = App.useApp();
  const { values, trigger, formRender, onFinish } = props;

  return (
    <EditFormModal
      title={
        <T
          id="component.form.add"
          values={{ title: <T id="page.menu.title" /> }}
        />
      }
      values={values}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading(t('component.form.message.add.loading'));
        try {
          await addMenu(formValues);
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

export default CreateMenuForm;
