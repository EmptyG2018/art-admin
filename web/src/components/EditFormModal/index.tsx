import React, { useState, useEffect, useRef } from 'react';
import { Modal, Flex, Button, FormInstance } from 'antd';
import { ProForm } from '@ant-design/pro-components';
import { T } from '@/locales';

interface EditFormWrapperProps {
  values?: any;
  request?: any;
  formRender: JSX.Element;
  formProps?: any;
  onCancel?: () => void;
  onFinish?: (values: any) => void;
}

interface EditFormMoalProps extends EditFormWrapperProps {
  modalProps?: any;
  trigger: JSX.Element;
  title: string;
}

const EditWrapperForm: React.FC<EditFormWrapperProps> = (props) => {
  const formRef = useRef<FormInstance>();
  const { values, request, formRender, formProps, onCancel, onFinish } = props;

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
        render: formProps?.readonly
          ? false
          : ({ form }) => {
              return (
                <Flex gap={8} justify="flex-end">
                  <Button key="cancel" onClick={() => onCancel?.()}>
                    <T id="component.form.cancel" />
                  </Button>
                  <Button
                    type="primary"
                    key="submit"
                    onClick={() => form?.submit?.()}
                  >
                    <T id="component.form.submit" />
                  </Button>
                </Flex>
              );
            },
      }}
      onFinish={onFinish}
      {...formProps}
    >
      {formRender}
    </ProForm>
  );
};

const EditFormModal: React.FC<EditFormMoalProps> = (props) => {
  const { trigger, title, modalProps, onFinish, ...rest } = props;
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
        {...modalProps}
      >
        <EditWrapperForm
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

export default EditFormModal;
