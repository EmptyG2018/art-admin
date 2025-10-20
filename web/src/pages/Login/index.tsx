import { SelectLang, ToggleFullscreenBtn } from '@/components/Layout';
import { queryCaptchaImage } from '@/services/auth';
import {
  LockOutlined,
  SafetyOutlined,
  UserOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { App, Button, Space, Tabs } from 'antd';
import { Logo } from '@/components/Layout';
import { useT, T } from '@/locales';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/stores';

const useStyles = createStyles(({ token, css }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    captchaImage: {
      paddingTop: 0,
      paddingBottom: 0,
      overflow: 'hidden',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
    tools: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: token.paddingSM,
      gap: 4,
    },
    footer: css`
      padding-block-start: ${token.paddingXL}px;
      padding-block-end: ${token.paddingLG}px;
      padding-inline: ${token.padding}px;
      text-align: center;

      p {
        color: ${token.colorTextTertiary};
        font-size: ${token.fontSize}px;
        margin-bottom: 0;
      }
    `,
  };
});

//  图形验证码
const CaptchaImage: React.FC<{
  onSuccess: (uuid: string) => void;
}> = ({ onSuccess }) => {
  const { styles } = useStyles();
  const { refresh, data, loading, error } = useRequest(queryCaptchaImage, {
    onSuccess(res) {
      res.uuid && onSuccess(res.uuid);
    },
  });

  if (error)
    return (
      <Button
        className={styles.captchaImage}
        size="large"
        danger
        onClick={refresh}
      >
        <T id="pages.login.captcha.getCaptchaText" />
      </Button>
    );

  if (loading)
    return (
      <Button className={styles.captchaImage} size="large" loading>
        <T id="layout.loading" />
      </Button>
    );

  return (
    <Button className={styles.captchaImage} size="large" onClick={refresh}>
      <div
        style={{ width: '100%', height: '100%' }}
        dangerouslySetInnerHTML={{ __html: data!.img }}
      />
    </Button>
  );
};

export const Component: React.FC = () => {
  const t = useT();
  const app = App.useApp();
  const { loginAccount } = useProfileStore();
  const [type, setType] = useState<string>('account');
  const [uuid, setUUID] = useState('');
  const navigate = useNavigate();
  const { styles } = useStyles();

  const handleSubmit = async (values: any) => {
    const { autoLogin, ...rest } = values;
    try {
      // 登录
      const res = await loginAccount({ ...rest, uuid });

      if (res.code === 200) {
        app.message.success(t('page.login.success'));
        const urlParams = new URL(window.location.href).searchParams;
        navigate(urlParams.get('redirect') || '/');
        return;
      }
    } catch (error) {
      app.message.error(t('page.login.error'));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tools}>
        <SelectLang />
        <ToggleFullscreenBtn />
      </div>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<Logo style={{ fontSize: 44 }} />}
          title="ART Admin"
          subTitle={<T id="page.login.subTitle" />}
          initialValues={{
            username: 'admin',
            password: 'admin123',
            autoLogin: true,
          }}
          onFinish={async (values: any) => {
            await handleSubmit(values);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: <T id="page.login.tab.accountLogin" />,
              },
              {
                key: 'mobile',
                label: <T id="page.login.tab.phoneLogin" />,
                disabled: true,
              },
            ]}
          />
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={t('component.form.placeholder', {
                  label: t('page.login.field.user'),
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <T
                        id="component.form.placeholder"
                        values={{ label: <T id="page.login.field.user" /> }}
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={t('component.form.placeholder', {
                  label: t('page.login.field.pswd'),
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <T
                        id="component.form.placeholder"
                        values={{ label: <T id="page.login.field.pswd" /> }}
                      />
                    ),
                  },
                ]}
              />
              <Space direction="horizontal" align="start">
                <ProFormText
                  name="code"
                  fieldProps={{
                    size: 'large',
                    prefix: <SafetyOutlined />,
                  }}
                  placeholder={t('component.form.placeholder', {
                    label: t('page.login.field.captcha'),
                  })}
                  rules={[
                    {
                      required: true,
                      message: <T id="page.login.field.captcha.rule" />,
                    },
                  ]}
                />
                <CaptchaImage onSuccess={(uuid) => setUUID(uuid)} />
              </Space>
            </>
          )}
          {type === 'mobile' && <></>}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <T id="page.login.rememberMe" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <T id="page.login.forgotPswd" />
            </a>
          </div>
        </LoginForm>
      </div>
      <div className={styles.footer}>
        <p>© 2025 Made with love</p>
        <p>
          Powered by{' '}
          <a
            href="https://github.com/EmptyG2018/art-admin"
            target="_blank"
            style={{ color: 'inherit' }}
          >
            <GithubOutlined />
          </a>
        </p>
      </div>
    </div>
  );
};
