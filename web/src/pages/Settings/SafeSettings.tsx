import { useState } from 'react';
import { App, Button, List, Modal, Flex, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useT, T } from '@/locales';
import { updatePwd } from '@/services/system';

const SafeSettings = () => {
  const app = App.useApp();
  const t = useT();
  const [form] = Form.useForm();
  const [editPwdModal, setEditPwdModal] = useState(false);

  return (
    <>
      <List
        rowKey="id"
        dataSource={[
          {
            id: '1',
            name: t('settings.security.password'),
            desc: t('settings.security.password.description'),
          },
        ]}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  if (item.id === '1') {
                    setEditPwdModal(true);
                  }
                }}
              >
                <T id="settings.security.password.update" />
              </Button>,
            ]}
          >
            <List.Item.Meta title={item.name} description={item.desc} />
          </List.Item>
        )}
      />
      <Modal
        open={editPwdModal}
        title={<T id="settings.security.form.title" />}
        footer={null}
        destroyOnHidden
        onCancel={() => setEditPwdModal(false)}
      >
        <ProForm
          form={form}
          submitter={{
            render: ({ form }) => {
              return (
                <Flex gap={8} justify="flex-end">
                  <Button key="cancel" onClick={() => setEditPwdModal(false)}>
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
          onFinish={async (formValues) => {
            const { newPassword2, ...data } = formValues;
            const hide = app.message.loading(
              t('component.form.message.update.loading'),
            );
            try {
              await updatePwd({ ...data });
              hide();
              app.message.success(t('component.form.message.update.success'));
              return true;
            } catch {
              hide();
              app.message.error(t('component.form.message.update.error'));
              return false;
            }
          }}
        >
          <ProFormText.Password
            name="oldPassword"
            label={<T id="settings.security.form.oldpassword" />}
            width="md"
            rules={[
              {
                required: true,
                message: t('component.form.placeholder', {
                  label: t('settings.security.form.oldpassword'),
                }),
              },
            ]}
          />
          <ProFormText.Password
            name="newPassword"
            label={<T id="settings.security.form.newpassword" />}
            width="md"
            rules={[
              {
                required: true,
                message: t('component.form.placeholder', {
                  label: t('settings.security.form.newpassword'),
                }),
              },
            ]}
          />
          <ProFormText.Password
            name="newPassword2"
            label={<T id="settings.security.form.confirmpassword" />}
            width="md"
            rules={[
              {
                required: true,
                message: t(
                  'settings.security.form.confirmpassword.placeholder',
                ),
              },
              {
                validator: (_, value) => {
                  if (value && value !== form.getFieldValue('newPassword'))
                    return Promise.reject(
                      new Error(
                        t('settings.security.form.confirmpassword.rule'),
                      ),
                    );

                  return Promise.resolve();
                },
              },
            ]}
          />
        </ProForm>
      </Modal>
    </>
  );
};

export default SafeSettings;
