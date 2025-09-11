import React from 'react';
import { App } from 'antd';
import { ProColumns } from '@ant-design/pro-components';
import EditNoticeForm from './EditNoticeForm';
import { updateNotice, getNotice } from '@/services/notice';

interface UpdateNoticeFormProps {
  trigger: JSX.Element;
  values: any;
  columns: ProColumns[];
  onFinish?: () => void;
}

const UpdateNoticeForm: React.FC<UpdateNoticeFormProps> = (props) => {
  const { message } = App.useApp();
  const { trigger, values, columns, onFinish } = props;

  return (
    <EditNoticeForm
      title="修改公告"
      request={async () => {
        const res = await getNotice(values.noticeId);
        return res.data;
      }}
      trigger={trigger}
      columns={columns}
      onFinish={async (formValues) => {
        const hide = message.loading('正在修改');
        try {
          await updateNotice({ ...values, ...formValues });
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

export default UpdateNoticeForm;
