import { Tooltip, Button, Statistic, Row, Col, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  StatisticCard,
} from '@ant-design/pro-components';
import KeyspacePie from './components/KeyspacePie';
import { useRequest, useResponsive } from 'ahooks';
import { queryCacheInfo } from '@/services/monitor';

export const Component = () => {
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
          <Tooltip title="刷新">
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
          <ProCard title="Redis信息">
            <Row gutter={[12, 24]} wrap>
              <Col span={24}>
                <Statistic.Timer
                  type="countup"
                  value={
                    new Date().getTime() - info?.state?.uptime_in_seconds * 1000
                  }
                  title="已运行时长"
                  format="D 天 HH 时 mm 分 ss 秒"
                />
              </Col>
              <Col span={12}>
                <Statistic title="版本" value={info?.state?.redis_version} />
              </Col>
              <Col span={12}>
                <Statistic title="端口" value={info?.state?.tcp_port} />
              </Col>
              <Col span={12}>
                <Statistic
                  title="模型"
                  value={
                    info?.state?.redis_mode == 'standalone' ? '单机' : '集群'
                  }
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="AOF是否启用"
                  value={info?.state?.aof_enabled == '0' ? '否' : '是'}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="客户端连接数量"
                  value={info?.state?.connected_clients}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="QPS"
                  value={info?.state?.instantaneous_ops_per_sec}
                />
              </Col>
            </Row>
          </ProCard>
          <ProCard title="缓存命中率">
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
