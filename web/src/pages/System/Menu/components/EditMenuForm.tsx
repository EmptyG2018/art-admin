import React, { useState, useEffect, useRef } from 'react';
import { Modal, Flex, Button, FormInstance } from 'antd';
import { ProForm } from '@ant-design/pro-components';

interface EditMenuWrapperFormProps {
  values?: any;
  request?: any;
  formRender: JSX.Element;
  onCancel?: () => void;
  onFinish?: (values: any) => void;
}

interface EditMenuFormProps extends EditMenuWrapperFormProps {
  trigger: JSX.Element;
  title: string;
}

interface EditMenuFormProps {
  title: string;
  values?: any;
  request?: any;
  trigger: JSX.Element;
  formRender: JSX.Element;
  onFinish?: (values: any) => void;
}

const EditMenuWrapperForm: React.FC<EditMenuWrapperFormProps> = (props) => {
  const formRef = useRef<FormInstance>();
  const { values, request, formRender, onCancel, onFinish } = props;

  useEffect(() => {
    if (values) formRef.current?.setFieldsValue(values);
  }, [values]);

  useEffect(() => {
    if (!request) return;

    const req = async () => {
      const data = await request();
      if (data) {
        formRef.current?.setFieldsValue(data);
      }
    };
    req();
  }, [request]);

  return (
    <ProForm
      formRef={formRef}
      submitter={{
        render: ({ form }) => {
          return (
            <Flex gap={8} justify="flex-end">
              <Button key="cancel" onClick={() => onCancel?.()}>
                取消
              </Button>
              <Button
                type="primary"
                key="submit"
                onClick={() => form?.submit?.()}
              >
                提交
              </Button>
            </Flex>
          );
        },
      }}
      onFinish={onFinish}
    >
      {formRender}
    </ProForm>
  );
};

const EditMenuForm: React.FC<EditMenuFormProps> = (props) => {
  const { trigger, title, onFinish, ...rest } = props;
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      {React.cloneElement(trigger, {
        onClick: () => setVisible(true),
      })}
      <Modal
        open={visible}
        title={title}
        width={800}
        footer={null}
        destroyOnHidden
        onCancel={() => setVisible(false)}
      >
        <EditMenuWrapperForm
          onFinish={async (values) => {
            const ok = await onFinish?.(values);
            if (ok) setVisible(false);
          }}
          onCancel={() => setVisible(false)}
          {...rest}
        />
      </Modal>
    </>
  );
};

export default EditMenuForm;
