import React, { PropsWithChildren } from 'react';
import { App } from 'antd';
import { ProColumns } from '@ant-design/pro-components';
import EditDictForm from './EditDictForm';
import { addDictType } from '@/services/dict';

interface CreateFormProps {
  trigger: JSX.Element;
  values?: any;
  columns: ProColumns[];
  onFinish?: () => void;
}

const CreateDictForm: React.FC<PropsWithChildren<CreateFormProps>> = (
  props,
) => {
  const { message } = App.useApp();
  const { trigger, values, columns, onFinish } = props;

  return (
    <EditDictForm
      title="新增岗位"
      values={values}
      columns={columns}
      trigger={trigger}
      onFinish={async (formValues) => {
        const hide = message.loading('正在添加');
        try {
          await addDictType(formValues);
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

export default CreateDictForm;

