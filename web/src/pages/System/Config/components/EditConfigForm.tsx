import React, { useState, useEffect, useRef } from 'react';
import { Modal, FormInstance, Button, Flex } from 'antd';
import { ProTable, ProColumns } from '@ant-design/pro-components';

interface EditConfigWrapperForm {
  values?: any;
  request?: any;
  columns: ProColumns[];
  onCancel?: () => void;
  onFinish?: (values: any) => void;
}

interface EditConfigForm extends EditConfigWrapperForm {
  trigger: JSX.Element;
  title: string;
}

const EditConfigWrapperForm: React.FC<EditConfigWrapperForm> = (props) => {
  const formRef = useRef<FormInstance>();
  const { values, request, columns, onCancel, onFinish } = props;

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
    <ProTable
      rowKey="id"
      type="form"
      formRef={formRef}
      columns={columns}
      form={{
        grid: true,
        rowProps: { gutter: 16 },
        submitter: {
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
        },
      }}
      onSubmit={onFinish}
    />
  );
};

const EditConfigForm: React.FC<EditConfigForm> = (props) => {
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
        <EditConfigWrapperForm
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

export default EditConfigForm;

