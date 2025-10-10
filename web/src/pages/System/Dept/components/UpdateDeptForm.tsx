import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { updateDept, getDept } from '@/services/dept';

interface UpdateDeptFormProps {
  trigger: JSX.Element;
  values: any;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const UpdateDeptForm: React.FC<UpdateDeptFormProps> = (props) => {
  const { message } = App.useApp();
  const { trigger, values, formRender, onFinish } = props;

  return (
    <EditFormModal
      title="修改部门"
      request={async () => {
        const res = await getDept(values.deptId);
        return res.data;
      }}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading('正在修改');
        try {
          await updateDept({ ...values, ...formValues });
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
