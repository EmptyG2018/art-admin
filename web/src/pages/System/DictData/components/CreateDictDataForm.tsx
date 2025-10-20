import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { useT, T } from '@/locales';
import { addDict } from '@/services/dict';

interface CreateDictDataFormProps {
  trigger: JSX.Element;
  values?: any;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const CreateDictDataForm: React.FC<CreateDictDataFormProps> = (props) => {
  const t = useT();
  const { message } = App.useApp();
  const { trigger, values, formRender, onFinish } = props;

  return (
    <EditFormModal
      title={
        <T
          id="component.form.add"
          values={{ title: <T id="page.dict.title" /> }}
        />
      }
      values={values}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading(t('component.form.message.add.loading'));
        try {
          await addDict({ ...values, ...formValues });
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

export default CreateDictDataForm;
