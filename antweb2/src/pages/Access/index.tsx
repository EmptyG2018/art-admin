import { PageContainer } from '@ant-design/pro-components';
import { Button } from 'antd';

const AccessPage: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '权限示例',
      }}
    >
      <Button>只有 Admin 可以看到这个按钮</Button>
    </PageContainer>
  );
};

export default AccessPage;

