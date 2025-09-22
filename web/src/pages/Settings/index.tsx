import { useState } from 'react';
import { Menu } from 'antd';
import { createStyles } from 'antd-style';
import BaseSettings from './BaseSettings';
import SafeSettings from './SafeSettings';
import ThemeSettings from './ThemeSettings';

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
