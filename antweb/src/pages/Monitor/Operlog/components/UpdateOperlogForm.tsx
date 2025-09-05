import React, { PropsWithChildren } from 'react';
import { ProColumns } from '@ant-design/pro-components';
import EditOperlogForm from './EditOperlogForm';

interface UpdateOperlogFormProps {
  trigger: JSX.Element;
  formDisabled?: boolean;
  values: any;
  columns: ProColumns[];
  onFinish?: () => void;
}

const UpdateOperlogForm: React.FC<PropsWithChildren<UpdateOperlogFormProps>> = (
  props,
) => {
  const { formDisabled, trigger, values, columns } = props;

  return (
    <EditOperlogForm
      title="查看操作日志"
      values={values}
      trigger={trigger}
      columns={columns}
      formDisabled={formDisabled}
    />
  );
};

export default UpdateOperlogForm;
