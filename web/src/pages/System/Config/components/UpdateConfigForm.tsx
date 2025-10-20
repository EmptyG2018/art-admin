import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { useT, T } from '@/locales';
import { updateConfig, getConfig } from '@/services/config';

interface UpdateConfigFormProps {
  trigger: JSX.Element;
  values: any;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const UpdateConfigForm: React.FC<UpdateConfigFormProps> = (props) => {
  const t = useT();
  const { message } = App.useApp();
  const { trigger, values, formRender, onFinish } = props;

  return (
    <EditFormModal
      title={
        <T
          id="component.form.update"
          values={{ title: <T id="page.config.title" /> }}
        />
      }
      request={async () => {
        const res = await getConfig(values.configId);
        return res.data;
      }}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading(
          t('component.form.message.update.loading'),
        );
        try {
          await updateConfig({ ...values, ...formValues });
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

export default UpdateConfigForm;
