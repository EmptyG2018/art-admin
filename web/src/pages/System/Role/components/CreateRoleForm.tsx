import { Modal } from 'antd';
import React, { PropsWithChildren } from 'react';
import EditRoleForm from './EditRoleForm';

interface CreateRoleFormProps {
  trigger: JSX.Element;
  onCancel: () => void;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = (props) => {
  const { trigger, onCancel } = props;

  return (
    <EditRoleForm
      title="新建角色"
      trigger={trigger}
      onFinish={() => {
        console.log('111');
      }}
    />
  );
};

export default CreateRoleForm;
