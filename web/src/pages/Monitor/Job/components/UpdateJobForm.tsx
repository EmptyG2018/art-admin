import React, { PropsWithChildren } from 'react';
import { App } from 'antd';
import { ProColumns } from '@ant-design/pro-components';
import EditJobForm from './EditJobForm';
import { updateJob, getJob } from '@/services/monitor';

interface UpdateJobFormProps {
  trigger: JSX.Element;
  values: any;
  columns: ProColumns[];
  onFinish?: () => void;
}

const UpdateJobForm: React.FC<UpdateJobFormProps> = (
  props,
) => {
  const { message } = App.useApp();
  const { trigger, values, columns, onFinish } = props;

  return (
    <EditJobForm
      title="修改定时任务"
      request={async () => {
        const res = await getJob(values.jobId);
        return res.data;
      }}
      trigger={trigger}
      columns={columns}
      onFinish={async (formValues) => {
        const hide = message.loading('正在修改');
        try {
          await updateJob({ ...values, ...formValues });
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

export default UpdateJobForm;
