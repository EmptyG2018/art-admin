import React from 'react';
import { App } from 'antd';
import { ProColumns } from '@ant-design/pro-components';
import EditJobForm from './EditJobForm';
import { addJob } from '@/services/monitor';

interface CreateJobFormProps {
  trigger: JSX.Element;
  values?: any;
  columns: ProColumns[];
  onFinish?: () => void;
}

const CreateJobForm: React.FC<CreateJobFormProps> = (
  props,
) => {
  const { message } = App.useApp();
  const { trigger, values, columns, onFinish } = props;

  return (
    <EditJobForm
      title="新增定时任务 "
      values={values}
      columns={columns}
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
