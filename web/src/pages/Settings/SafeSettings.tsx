import { useState } from 'react';
import { App, Button, List, Modal, Flex, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { updatePwd } from '@/services/system';
import { useIntl, FormattedMessage } from 'react-intl';

const SafeSettings = () => {
  const app = App.useApp();
  const intl = useIntl();
  const [form] = Form.useForm();
  const [editPwdModal, setEditPwdModal] = useState(false);

  return (
    <>
      <List
        rowKey="id"
        dataSource={[
          {
            id: '1',
            name: intl.formatMessage({
              id: 'settings.security.password',
              defaultMessage: '账户密码',
            }),
            desc: intl.formatMessage({
              id: 'settings.security.password.description',
              defaultMessage: '保护个人账户安全，保障信息不泄露',
            }),
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
                <FormattedMessage
                  id="component.form.update"
                  defaultMessage="修改{title}"
                  values={{ title: '' }}
                />
              </Button>,
            ]}
          >
            <List.Item.Meta title={item.name} description={item.desc} />
          </List.Item>
        )}
      />
      <Modal
        open={editPwdModal}
        title={
          <FormattedMessage
            id="settings.security.form.title"
            defaultMessage="修改密码"
          />
        }
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
                    <FormattedMessage
                      id="component.form.cancel"
                      defaultMessage="取消"
                    />
                  </Button>
                  <Button
                    type="primary"
                    key="submit"
                    onClick={() => form?.submit?.()}
                  >
                    <FormattedMessage
                      id="component.form.submit"
                      defaultMessage="提交"
                    />
                  </Button>
                </Flex>
              );
            },
          }}
          onFinish={async (formValues) => {
            const { newPassword2, ...data } = formValues;
            const hide = app.message.loading(
              intl.formatMessage({
                id: 'component.form.message.update.loading',
                defaultMessage: '正在修改',
              }),
            );
            try {
              await updatePwd({ ...data });
              hide();
              app.message.success(
                intl.formatMessage({
                  id: 'component.form.message.update.success',
                  defaultMessage: '修改成功',
                }),
              );
              return true;
            } catch {
              hide();
              app.message.error(
                intl.formatMessage({
                  id: 'component.form.message.update.error',
                  defaultMessage: '修改失败请重试！',
                }),
              );
              return false;
            }
          }}
        >
          <ProFormText.Password
            name="oldPassword"
            label={
              <FormattedMessage
                id="settings.security.form.oldpassword"
                defaultMessage="旧密码"
              />
            }
            width="md"
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  {
                    id: 'component.form.placeholder',
                    defaultMessage: '请输入{label}',
                  },
                  {
                    label: intl.formatMessage({
                      id: 'settings.security.form.oldpassword',
                      defaultMessage: '旧密码',
                    }),
                  },
                ),
              },
            ]}
          />
          <ProFormText.Password
            name="newPassword"
            label={
              <FormattedMessage
                id="settings.security.form.newpassword"
                defaultMessage="新密码"
              />
            }
            width="md"
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  {
                    id: 'component.form.placeholder',
                    defaultMessage: '请输入{label}',
                  },
                  {
                    label: intl.formatMessage({
                      id: 'settings.security.form.newpassword',
                      defaultMessage: '新密码',
                    }),
                  },
                ),
              },
            ]}
          />
          <ProFormText.Password
            name="newPassword2"
            label={
              <FormattedMessage
                id="settings.security.form.confirmpassword"
                defaultMessage="确认密码"
              />
            }
            width="md"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'settings.security.form.confirmpassword.placeholder',
                  defaultMessage: '请再次输入密码',
                }),
              },
              {
                validator: (_, value) => {
                  if (value && value !== form.getFieldValue('newPassword'))
                    return Promise.reject(
                      new Error(
                        intl.formatMessage({
                          id: 'settings.security.form.confirmpassword.rule',
                          defaultMessage: '两次输入的密码不一致！',
                        }),
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
