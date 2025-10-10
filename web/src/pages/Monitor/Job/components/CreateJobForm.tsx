import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { addJob } from '@/services/monitor';

interface CreateJobFormProps {
  trigger: JSX.Element;
  values?: any;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const CreateJobForm: React.FC<CreateJobFormProps> = (props) => {
  const { message } = App.useApp();
  const { trigger, values, formRender, onFinish } = props;

  return (
    <EditFormModal
      title="新增定时任务 "
      values={values}
      formRender={formRender}
      trigger={trigger}
      onFinish={async (formValues) => {
        const hide = message.loading('正在添加');
        try {
          await addJob(formValues);
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

export default CreateJobForm;
