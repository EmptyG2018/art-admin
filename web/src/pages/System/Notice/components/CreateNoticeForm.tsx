import React, { PropsWithChildren } from 'react';
import { App } from 'antd';
import { ProColumns } from '@ant-design/pro-components';
import EditNoticeForm from './EditNoticeForm';
import { addNotice } from '@/services/notice';

interface CreateNoticeFormProps {
  trigger: JSX.Element;
  values?: any;
  columns: ProColumns[];
  onFinish?: () => void;
}

const CreateNoticeForm: React.FC<PropsWithChildren<CreateNoticeFormProps>> = (
  props,
) => {
  const { message } = App.useApp();
  const { trigger, values, columns, onFinish } = props;

  return (
    <EditNoticeForm
      title="新增公告"
      values={values}
      columns={columns}
      trigger={trigger}
      onFinish={async (formValues) => {
        const hide = message.loading('正在添加');
        try {
          await addNotice(formValues);
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

export default CreateNoticeForm;
