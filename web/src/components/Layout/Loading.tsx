import { Flex, Spin } from 'antd';

const Loading = () => {
  return (
    <Flex
      align="center"
      justify="center"
      style={{ width: '100%', height: '100%' }}
    >
      <Spin size="large" />
    </Flex>
  );
};

export default Loading;
