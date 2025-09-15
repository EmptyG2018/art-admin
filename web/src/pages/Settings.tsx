import { createStyles } from 'antd-style';
import { Layout, Menu } from 'antd';

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
    padding: ${token.paddingLG}px;
  `,
}));

export const Component = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['profile']}
          items={[
            { key: 'profile', label: '基本设置' },
            { key: 'security', label: '安全设置' },
            { key: 'appearance', label: '主题外观' },
          ]}
        />
      </div>
      <div className={styles.content}>
        <h1>个人资料</h1>
        <p>这里是个人资料设置的内容...</p>
      </div>
    </div>
  );
};
