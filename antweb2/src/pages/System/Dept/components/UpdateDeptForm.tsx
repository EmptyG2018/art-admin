import React, { PropsWithChildren } from 'react';
import { App } from 'antd';
import { ProColumns } from '@ant-design/pro-components';
import EditDeptForm from './EditDeptForm';
import { updateDept, getDept } from '@/services/dept';

interface UpdateDeptFormProps {
  trigger: JSX.Element;
  values: any;
  columns: ProColumns[];
  onFinish?: () => void;
}

const UpdateDeptForm: React.FC<PropsWithChildren<UpdateDeptFormProps>> = (
  props,
) => {
  const { message } = App.useApp();
  const { trigger, values, columns, onFinish } = props;

  return (
    <EditDeptForm
      title="修改部门"
      request={async () => {
        const res = await getDept(values.deptId);
        return res.data;
      }}
      trigger={trigger}
      columns={columns}
      onFinish={async (formValues) => {
        const hide = message.loading('正在修改');
        try {
          await updateDept({  ...values, ...formValues, });
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

export default UpdateDeptForm;
