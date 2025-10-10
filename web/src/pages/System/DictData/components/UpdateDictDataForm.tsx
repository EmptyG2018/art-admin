import React from 'react';
import { App } from 'antd';
import { EditFormModal } from '@/components';
import { updateDict, getDict } from '@/services/dict';

interface UpdateDictDataFormProps {
  trigger: JSX.Element;
  values: any;
  formRender: JSX.Element;
  onFinish?: () => void;
}

const UpdateDictDataForm: React.FC<UpdateDictDataFormProps> = (props) => {
  const { message } = App.useApp();
  const { trigger, values, formRender, onFinish } = props;

  return (
    <EditFormModal
      title="修改岗位"
      request={async () => {
        const res = await getDict(values.dictCode);
        return res.data;
      }}
      trigger={trigger}
      formRender={formRender}
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
