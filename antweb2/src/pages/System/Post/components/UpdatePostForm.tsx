import React, { PropsWithChildren } from 'react';
import { App } from 'antd';
import { ProColumns } from '@ant-design/pro-components';
import EditPostForm from './EditPostForm';
import { updatePost, getPost } from '@/services/post';

interface UpdatePostFormProps {
  trigger: JSX.Element;
  values: any;
  columns: ProColumns[];
  onFinish?: () => void;
}

const UpdatePostForm: React.FC<PropsWithChildren<UpdatePostFormProps>> = (
  props,
) => {
  const { message } = App.useApp();
  const { trigger, values, columns, onFinish } = props;

  return (
    <EditPostForm
      title="修改岗位"
      request={async () => {
        const res = await getPost(values.postId);
        return res.data;
      }}
      trigger={trigger}
      columns={columns}
      onFinish={async (formValues) => {
        const hide = message.loading('正在修改');
        try {
          await updatePost({ ...values, ...formValues });
          onFinish?.();
          hide();
          message.success('修改成功');
          return true;
        } catch {
          hide();
          message.error('修改失败请重试！');
          return false;
        }
      }}
    />
  );
};

export default UpdatePostForm;

