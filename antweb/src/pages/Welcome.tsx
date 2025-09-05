import React from 'react';
import { Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-components';

const { Title, Paragraph, Text } = Typography;

export const Component: React.FC = () => {
  return (
    <PageContainer title={false}>
      <Title level={2} style={{ marginBottom: '0.5em' }}>
        欢迎登录管理系统
      </Title>

      <Paragraph style={{ fontSize: '16px' }}>亲爱的管理员，您好！</Paragraph>

      <Paragraph style={{ fontSize: '16px' }}>
        感谢您使用我们的后台管理系统。您已成功登录，现在可以开始进行日常管理操作了。
      </Paragraph>

      <Title level={4} style={{ marginTop: '1.5em', marginBottom: '0.75em' }}>
        在这里，您可以：
      </Title>
      <ul style={{ paddingLeft: '20px', fontSize: '15px' }}>
        <li style={{ marginBottom: '8px' }}>
          <Text>管理用户账号与权限</Text>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <Text>配置系统参数与功能</Text>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <Text>查看业务数据与报表</Text>
        </li>
        <li>
          <Text>监控系统运行状态</Text>
        </li>
      </ul>

      <Title level={5} style={{ marginTop: '1.5em', marginBottom: '0.5em' }}>
        📌 温馨提示
      </Title>
      <Paragraph type="secondary" style={{ fontSize: '14px' }}>
        为了保障系统安全，请勿在公共设备上长期保持登录状态。
      </Paragraph>
      <Paragraph type="secondary" style={{ fontSize: '14px' }}>
        如遇到任何使用问题，请通过“帮助中心”提交反馈，我们将尽快为您解答。
      </Paragraph>

      <Title level={5} style={{ marginTop: '1.5em', marginBottom: '0.5em' }}>
        💡 小贴士
      </Title>
      <Paragraph style={{ fontSize: '14px' }}>
        <Text>• 定期更新密码，有助于提升账户安全性。</Text>
        <br />
        <Text>• 使用“快捷操作”面板可以大幅提升工作效率。</Text>
      </Paragraph>

      <Paragraph style={{ marginTop: '2em', fontSize: '15px' }}>
        我们致力于为您提供稳定、高效、安全的管理体验。感谢您的信任与支持！
      </Paragraph>

      <Paragraph
        type="secondary"
        style={{ fontSize: '12px', marginTop: '3em' }}
      >
        © {new Date().getFullYear()} 管理系统 - 让管理更简单
      </Paragraph>
    </PageContainer>
  );
};
