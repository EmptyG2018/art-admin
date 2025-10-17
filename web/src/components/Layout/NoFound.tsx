import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useT, T } from '@/locales';

const NoFound: React.FC<{ showHomeBtn?: boolean }> = ({ showHomeBtn }) => {
  const t = useT();
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('layout.404.subTitle')}
      extra={
        showHomeBtn && (
          <Button type="primary" onClick={() => navigate('/')}>
            <T id="layout.404.buttonText" />
          </Button>
        )
      }
    />
  );
};

export default NoFound;
