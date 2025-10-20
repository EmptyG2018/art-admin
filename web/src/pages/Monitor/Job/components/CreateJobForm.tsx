import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { useT, T } from '@/locales';
import { addJob } from '@/services/monitor';

interface CreateJobFormProps {
  trigger: JSX.Element;
  values?: any;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const CreateJobForm: React.FC<CreateJobFormProps> = (props) => {
  const t = useT();
  const { message } = App.useApp();
  const { trigger, values, formRender, onFinish } = props;

  return (
    <EditFormModal
      title={
        <T
          id="component.form.add"
          values={{ title: <T id="page.job.title" /> }}
        />
      }
      values={values}
      formRender={formRender}
      trigger={trigger}
      onFinish={async (formValues) => {
        const hide = message.loading(t('component.form.message.add.loading'));
        try {
          await addJob(formValues);
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

export default CreateJobForm;
