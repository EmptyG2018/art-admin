import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { useT, T } from '@/locales';
import { addPost } from '@/services/post';

interface CreateFormProps {
  trigger: JSX.Element;
  values?: any;
  formRedner: JSX.Element;
  onFinish?: () => void;
}

const CreatePostForm: React.FC<CreateFormProps> = (props) => {
  const t = useT();
  const { message } = App.useApp();
  const { trigger, values, formRedner, onFinish } = props;

  return (
    <EditFormModal
      title={
        <T
          id="component.form.add"
          values={{ title: <T id="page.post.title" /> }}
        />
      }
      values={values}
      trigger={trigger}
      formRender={formRedner}
      onFinish={async (formValues) => {
        const hide = message.loading(t('component.form.message.add.loading'));
        try {
          await addPost(formValues);
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

export default CreatePostForm;
