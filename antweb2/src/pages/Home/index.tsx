import { PageContainer } from '@ant-design/pro-components';
import Guide from '@/components/Guide';

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div style={{ paddingTop: '80px' }}>
        <Guide name="admin" />
      </div>
    </PageContainer>
  );
};

export default HomePage;
