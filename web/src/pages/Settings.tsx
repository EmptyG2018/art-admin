import { useState } from 'react';
import { App, Button, Menu, List, Modal, Flex, Form, Radio } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { ProForm, ProFormText, ProFormRadio } from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { getProfile, updateProfile, updatePwd } from '@/services/system';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    display: flex;
    padding-top: ${token.padding}px;
    padding-bottom: ${token.padding}px;
    background-color: ${token.colorBgContainer};
  `,

  nav: css`
    width: 224px;
    border-right: 1px solid ${token.colorBorderSecondary};
  `,

  content: css`
    flex: 1;
    padding: 8px 40px;
  `,

  title: css`
    margin-bottom: ${token.marginSM}px;
    color: ${token.colorText};
    font-weight: 500;
    font-size: ${token.sizeMD}px;
  `,

  themeStyle: css`
    display: flex;
    gap: 12px;
  `,

  themeStyleLight: css`
    width: 64px;
    height: 48px;
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid ${token.colorBorder};
  `,

  themeStyleDark: css`
    position: relative;
    width: 64px;
    height: 48px;
    background-color: rgba(0, 21, 41, 0.85);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid ${token.colorBorder};
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 16px;
      background-color: rgba(0, 0, 0, 0.85);
      top: 0;
      left: 0;
    }
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.65);
      top: 0;
      left: 0;
    }
  `,
}));

const BaseSettings = () => {
  const app = App.useApp();

  return (
    <ProForm
      layout="vertical"
      request={async () => {
        const { postGroup, roleGroup, data } = await getProfile();

        return {
          ...data,
          deptStr: data?.dept?.deptName + ' / ' + postGroup,
          roleStr: roleGroup,
        };
      }}
      submitter={{
        render: ({ form }) => {
          return [
            <Button
              type="primary"
              key="submit"
              onClick={() => form?.submit?.()}
            >
              更新资料
            </Button>,
          ];
        },
      }}
      onFinish={async (formValues) => {
        const { deptStr, roleStr, ...data } = formValues;
        const hide = app.message.loading('正在更新');
        try {
          await updateProfile({ ...data });
          hide();
          app.message.success('更新成功');
          return true;
        } catch {
          hide();
          app.message.error('更新失败请重试！');
          return false;
        }
      }}
    >
      <ProFormText
        name="nickName"
        label="昵称"
        width="md"
        rules={[{ required: true, message: '请输入昵称' }]}
      />
      <ProFormText
        name="phonenumber"
        label="手机号码"
        width="sm"
        rules={[{ required: true, message: '请输入手机号码' }]}
      />
      <ProFormText
        name="email"
        label="邮箱"
        width="md"
        rules={[{ required: true, message: '请输入邮箱' }]}
      />
      <ProFormRadio.Group
        name="sex"
        label="性别"
        request={async () => {
          const res = await queryDictsByType('sys_user_sex');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
      />
    </ProForm>
  );
};

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
            desc: '当前密码强度：强',
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
        destroyOnClose
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

const ThemeBlockSelect = ({ value, onChange }) => {
  const { styles } = useStyles();
  // const [value, setValue] = useState(value);

  return (
    <div className={styles.themeStyle}>
      <div className={styles.themeStyleLight}></div>
      <div className={styles.themeStyleDark}></div>
    </div>
  );
};

const ThemeSettings = () => {
  const app = App.useApp();
  const { styles } = useStyles();

  return (
    <ProForm
      layout="vertical"
      request={async () => {
        const { postGroup, roleGroup, data } = await getProfile();

        return {
          ...data,
          deptStr: data?.dept?.deptName + ' / ' + postGroup,
          roleStr: roleGroup,
        };
      }}
      submitter={{
        render: ({ form }) => {
          return [
            <Button
              type="primary"
              key="submit"
              onClick={() => form?.submit?.()}
            >
              更新资料
            </Button>,
          ];
        },
      }}
      onFinish={async (formValues) => {
        const { deptStr, roleStr, ...data } = formValues;
        const hide = app.message.loading('正在更新');
        try {
          await updateProfile({ ...data });
          hide();
          app.message.success('更新成功');
          return true;
        } catch {
          hide();
          app.message.error('更新失败请重试！');
          return false;
        }
      }}
    >
      <Form.Item label="整体风格设置">
        <Radio.Group
          options={[
            { value: 1, label: <div className={styles.themeStyleLight}></div> },
            { value: 2, label: <div className={styles.themeStyleDark}></div> },
          ]}
        />
      </Form.Item>
      <ProFormText
        name="phonenumber"
        label="手机号码"
        width="sm"
        rules={[{ required: true, message: '请输入手机号码' }]}
      />
      <ProFormText
        name="email"
        label="邮箱"
        width="md"
        rules={[{ required: true, message: '请输入邮箱' }]}
      />
      <ProFormRadio.Group
        name="sex"
        label="性别"
        request={async () => {
          const res = await queryDictsByType('sys_user_sex');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
      />
    </ProForm>
  );
};

export const Component = () => {
  const { styles } = useStyles();
  const [selectedKeys, setSelectedKeys] = useState(['profile']);

  const nav = [
    { key: 'profile', label: '基本设置', render: <BaseSettings /> },
    { key: 'security', label: '安全设置', render: <SafeSettings /> },
    { key: 'appearance', label: '主题外观', render: <ThemeSettings /> },
  ];

  const contentRender = () => {
    const item = nav.find((item) => item.key === selectedKeys[0]);
    if (!item) return;

    return (
      <>
        <div className={styles.title}>{item.label}</div>
        {item.render}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={nav.map(({ label, key }) => ({ label, key }))}
          onClick={(e) => setSelectedKeys([e.key])}
        />
      </div>
      <div className={styles.content}>{contentRender()}</div>
    </div>
  );
};
