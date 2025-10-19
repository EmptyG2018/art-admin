import { Tooltip, Button, Statistic, Row, Col, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import KeyspacePie from './components/KeyspacePie';
import { rawT, useT, T } from '@/locales';
import { useRequest, useResponsive } from 'ahooks';
import { queryCacheInfo } from '@/services/monitor';

export const Component = () => {
  const t = useT();
  const responsive = useResponsive();
  const {
    data: info,
    loading,
    refresh,
  } = useRequest(async () => {
    const res = await queryCacheInfo();
    const { info, dbSize, commandStats } = res.data;
    return {
      state: info || {},
      dbSize: dbSize || 0,
      commandStats: commandStats || [],
    };
  });

  return (
    <PageContainer header={{ title: false }}>
      <ProCard
        title="缓存监控"
        extra={
          <Tooltip title={<T id="page.monitor.cache.refresh" />}>
            <Button
              type="link"
              icon={<ReloadOutlined />}
              disabled={loading}
              onClick={() => refresh()}
            />
          </Tooltip>
        }
        split="horizontal"
        loading={
          loading ? (
            <div style={{ paddingBlock: 40, textAlign: 'center' }}>
              <Spin />
            </div>
          ) : null
        }
        headerBordered
      >
        <ProCard split={responsive.lg ? 'vertical' : 'horizontal'}>
          <ProCard title={<T id="page.monitor.cache.info" />}>
            <Row gutter={[12, 24]} wrap>
              <Col span={24}>
                <Statistic.Timer
                  type="countup"
                  value={
                    new Date().getTime() - info?.state?.uptime_in_seconds * 1000
                  }
                  title={<T id="page.monitor.cache.runTime" />}
                  format={t('page.monitor.cache.runTime.format')}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<T id="page.monitor.cache.version" />}
                  value={info?.state?.redis_version}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<T id="page.monitor.cache.port" />}
                  value={info?.state?.tcp_port}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<T id="page.monitor.cache.model" />}
                  value={
                    info?.state?.redis_mode == 'standalone'
                      ? t('page.monitor.cache.model.single')
                      : t('page.monitor.cache.model.cluster')
                  }
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<T id="page.monitor.cache.aof" />}
                  value={
                    info?.state?.aof_enabled == '0'
                      ? t('page.monitor.cache.aof.false')
                      : t('page.monitor.cache.aof.true')
                  }
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<T id="page.monitor.cache.client" />}
                  value={info?.state?.connected_clients}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<T id="page.monitor.cache.qps" />}
                  value={info?.state?.instantaneous_ops_per_sec}
                />
              </Col>
            </Row>
          </ProCard>
          <ProCard title={<T id="page.monitor.cache.keyspace" />}>
            <KeyspacePie
              data={{
                hits: info?.state?.keyspace_hits,
                misses: info?.state?.keyspace_misses,
              }}
            />
          </ProCard>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
