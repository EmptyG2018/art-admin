import React, { PropsWithChildren } from 'react';
import { App } from 'antd';
import { ProColumns } from '@ant-design/pro-components';
import EditDictDataForm from './EditDictDataForm';
import { addDict } from '@/services/dict';

interface CreateDictDataFormProps {
  trigger: JSX.Element;
  values?: any;
  columns: ProColumns[];
  onFinish?: () => void;
}

const CreateDictDataForm: React.FC<
  PropsWithChildren<CreateDictDataFormProps>
> = (props) => {
  const { message } = App.useApp();
  const { trigger, values, columns, onFinish } = props;

  return (
    <EditDictDataForm
      title="新增岗位"
      values={values}
      columns={columns}
      trigger={trigger}
      onFinish={async (formValues) => {
        const hide = message.loading('正在添加');
        try {
          await addDict({ ...values, ...formValues });
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

export default CreateDictDataForm;
