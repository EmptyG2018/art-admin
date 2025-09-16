import { App, Button, Menu, Row, Col } from 'antd';
import { createStyles } from 'antd-style';
import { ProForm, ProFormText, ProFormRadio } from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { getProfile, updateProfile } from '@/services/system';
import { useState } from 'react';

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
      <ProForm.Group>
        <ProFormText
          name="nickName"
          label="昵称"
          rules={[{ required: true, message: '请输入昵称' }]}
        />
        <ProFormText name="userName" label="用户名" readonly />
      </ProForm.Group>
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
      <ProFormText name="deptStr" label="所属部门" readonly />
      <ProFormText name="roleStr" label="所属角色" readonly />
    </ProForm>
  );
};

const SafeSettings = () => {
  return <div>this is safe.</div>;
};

const ThemeSettings = () => {
  return <div>this is theme.</div>;
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
