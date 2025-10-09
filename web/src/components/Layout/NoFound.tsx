import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useIntl } from 'react-intl';

const NoFound: React.FC<{ showHomeBtn?: boolean }> = ({ showHomeBtn }) => {
  const intl = useIntl();
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle={intl.formatMessage({ id: 'pages.404.subTitle' })}
      extra={
        showHomeBtn && (
          <Button type="primary" onClick={() => navigate('/')}>
            {intl.formatMessage({ id: 'pages.404.buttonText' })}
          </Button>
        )
      }
    />
  );
};

export default NoFound;
