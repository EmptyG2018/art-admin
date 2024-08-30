import { SelectLang, Footer } from '@/components/Layout';
import { queryCaptchaImage } from '@/services/auth';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  SafetyOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { useIntl, FormattedMessage } from 'react-intl';
import { useRequest } from 'ahooks';
import { App, Alert, Button, message, Space, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/stores/module/user';
import Settings from '@/defaultSettings';

const useStyles = createStyles(({ token }) => {
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
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
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
  };
});

const ActionIcons = () => {
  const { styles } = useStyles();

  return (
    <>
      <AlipayCircleOutlined
        key="AlipayCircleOutlined"
        className={styles.action}
      />
      <TaobaoCircleOutlined
        key="TaobaoCircleOutlined"
        className={styles.action}
      />
      <WeiboCircleOutlined
        key="WeiboCircleOutlined"
        className={styles.action}
      />
    </>
  );
};

// 国际化语言
const Lang: React.FC = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      <SelectLang />
    </div>
  );
};

// 登录提示信息
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

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
        <FormattedMessage
          id="pages.login.captcha.getCaptchaText"
          defaultMessage="重新获取"
        />
      </Button>
    );

  if (loading)
    return (
      <Button className={styles.captchaImage} size="large" loading>
        <FormattedMessage id="pages.loading" defaultMessage="正在加载" />
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

const LoginPage: React.FC = () => {
  const app = App.useApp();
  const { loginAccount } = useUserStore();
  const [userLoginState, setUserLoginState] = useState<any>({});
  const [type, setType] = useState<string>('account');
  const [uuid, setUUID] = useState('');
  const navigate = useNavigate();
  const { styles } = useStyles();
  const intl = useIntl();
  const { status, type: loginType } = userLoginState;

  const handleSubmit = async (values: any) => {
    const { autoLogin, ...rest } = values;
    try {
      // 登录
      const res = await loginAccount({ ...rest, uuid });

      console.log('xxx', res);
      if (res.code === 200) {
        
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        app.message.success(defaultLoginSuccessMessage);
        // await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        navigate(urlParams.get('redirect') || '/');
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(res.msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      app.message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <title>
        {intl.formatMessage({
          id: 'menu.login',
          defaultMessage: '登录',
        })}
        - {Settings.title}
      </title>
      <Lang />
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
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          subTitle={intl.formatMessage({
            id: 'pages.layouts.userLayout.title',
          })}
          initialValues={{
            username: 'admin',
            password: 'admin123',
            autoLogin: true,
          }}
          actions={[
            <FormattedMessage
              key="loginWith"
              id="pages.login.loginWith"
              defaultMessage="其他登录方式"
            />,
            <ActionIcons key="icons" />,
          ]}
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
                label: intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                }),
              },
              {
                key: 'mobile',
                label: intl.formatMessage({
                  id: 'pages.login.phoneLogin.tab',
                  defaultMessage: '手机号登录（待开发）',
                }),
                disabled: true,
              },
            ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
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
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
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
                  placeholder={intl.formatMessage({
                    id: 'pages.login.captcha.placeholder',
                    defaultMessage: '请输入验证码！',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.captcha.required"
                          defaultMessage="验证码是必填项！"
                        />
                      ),
                    },
                  ]}
                />
                <CaptchaImage onSuccess={(uuid) => setUUID(uuid)} />
              </Space>
            </>
          )}

          {status === 'error' && loginType === 'mobile' && (
            <LoginMessage content="验证码错误" />
          )}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage
                id="pages.login.rememberMe"
                defaultMessage="自动登录"
              />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage
                id="pages.login.forgotPassword"
                defaultMessage="忘记密码"
              />
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
