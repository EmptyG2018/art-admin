import React, { PropsWithChildren } from 'react';
import { App } from 'antd';
import { ProColumns } from '@ant-design/pro-components';
import EditDictDataForm from './EditDictDataForm';
import { updateDict, getDict } from '@/services/dict';

interface UpdateDictDataFormProps {
  trigger: JSX.Element;
  values: any;
  columns: ProColumns[];
  onFinish?: () => void;
}

const UpdateDictDataForm: React.FC<
  PropsWithChildren<UpdateDictDataFormProps>
> = (props) => {
  const { message } = App.useApp();
  const { trigger, values, columns, onFinish } = props;

  return (
    <EditDictDataForm
      title="修改岗位"
      request={async () => {
        const res = await getDict(values.dictCode);
        return res.data;
      }}
      trigger={trigger}
      columns={columns}
      onFinish={async (formValues) => {
        const hide = message.loading('正在修改');
        try {
          await updateDict({ ...values, ...formValues });
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

export default UpdateDictDataForm;
