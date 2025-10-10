import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { updateDictType, getDictType } from '@/services/dict';

interface UpdateDictFormProps {
  trigger: JSX.Element;
  values: any;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const UpdateDictForm: React.FC<UpdateDictFormProps> = (props) => {
  const { message } = App.useApp();
  const { trigger, values, formRender, onFinish } = props;

  return (
    <EditFormModal
      title="修改岗位"
      request={async () => {
        const res = await getDictType(values.dictId);
        return res.data;
      }}
      trigger={trigger}
      formRender={formRender}
      onFinish={async (formValues) => {
        const hide = message.loading('正在修改');
        try {
          await updateDictType({ ...values, ...formValues });
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

export default UpdateDictForm;
