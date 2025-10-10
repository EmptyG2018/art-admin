import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { addPost } from '@/services/post';

interface CreateFormProps {
  trigger: JSX.Element;
  values?: any;
  formRedner: JSX.Element;
  onFinish?: () => void;
}

const CreatePostForm: React.FC<CreateFormProps> = (props) => {
  const { message } = App.useApp();
  const { trigger, values, formRedner, onFinish } = props;

  return (
    <EditFormModal
      title="新增岗位"
      values={values}
      trigger={trigger}
      formRender={formRedner}
      onFinish={async (formValues) => {
        const hide = message.loading('正在添加');
        try {
          await addPost(formValues);
          onFinish?.();
          hide();
          message.success('添加成功');
          return true;
        } catch {
          hide();
          message.error('添加失败请重试！');
          return false;
        }
      }}
    />
  );
};

export default CreatePostForm;
