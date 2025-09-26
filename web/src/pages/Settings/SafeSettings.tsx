import { useState } from 'react';
import { App, Button, List, Modal, Flex, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { updatePwd } from '@/services/system';

const SafeSettings = () => {
  const app = App.useApp();
  const [form] = Form.useForm();
  const [editPwdModal, setEditPwdModal] = useState(false);

  return (
    <>
      <List
        rowKey="id"
        dataSource={[
          {
            id: '1',
            name: '账户密码',
            desc: '保护个人账户安全，保障信息不泄露',
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
                修改
              </Button>,
            ]}
          >
            <List.Item.Meta title={item.name} description={item.desc} />
          </List.Item>
        )}
      />
      <Modal
        open={editPwdModal}
        title="修改密码"
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
          onFinish={async (formValues) => {
            const { newPassword2, ...data } = formValues;
            const hide = app.message.loading('正在修改');
            try {
              await updatePwd({ ...data });
              hide();
              app.message.success('修改成功');
              return true;
            } catch {
              hide();
              app.message.error('修改失败请重试！');
              return false;
            }
          }}
        >
          <ProFormText.Password
            name="oldPassword"
            label="旧密码"
            width="md"
            rules={[{ required: true, message: '请输入旧密码' }]}
          />
          <ProFormText.Password
            name="newPassword"
            label="新密码"
            width="md"
            rules={[{ required: true, message: '请输入新密码' }]}
          />
          <ProFormText.Password
            name="newPassword2"
            label="确认密码"
            width="md"
            rules={[
              { required: true, message: '请再次输入密码' },
              {
                validator: (_, value) => {
                  if (value !== form.getFieldValue('newPassword'))
                    return Promise.reject(new Error('两次输入的密码不一致！'));

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

