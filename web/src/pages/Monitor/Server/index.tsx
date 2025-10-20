import { Tooltip, Button, Statistic, Row, Col, Progress, Spin } from 'antd';
import { DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  StatisticCard,
} from '@ant-design/pro-components';
import { rawT, useT, T } from '@/locales';
import { useRequest, useResponsive } from 'ahooks';
import { queryServerInfo } from '@/services/monitor';

const DiskList: React.FC<{ list: any }> = ({ list }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {list.map((disk) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <DatabaseOutlined style={{ fontSize: 24 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
              {disk.dirName}
            </div>
            <Progress
              percent={disk.usage}
              percentPosition={{ align: 'end', type: 'inner' }}
              strokeLinecap="butt"
              size={{ height: 20 }}
            />
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
              <T
                id="page.monitor.server.disk.useTips"
                values={{ used: disk.used, total: disk.total }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Component = () => {
  const t = useT();
  const responsive = useResponsive();
  const {
    data: info,
    loading,
    refresh,
  } = useRequest(async () => {
    const res = await queryServerInfo();
    const { cpu, mem, node, sys, sysFiles } = res.data;
    return {
      cpu: cpu || {},
      mem: mem || {},
      node: node || {},
      sys: sys || {},
      sysFiles: sysFiles || [],
    };
  });

  const cpuUsed = info?.cpu?.used ? parseFloat(info.cpu.used) : 0;
  const cpuSys = info?.cpu?.sys ? parseFloat(info.cpu.sys) : 0;
  const cpuUsage = (cpuUsed * 100 + cpuSys * 100) / 100;

  return (
    <PageContainer header={{ title: false }}>
      <ProCard
        title={<T id="menu.monitor.server" />}
        extra={
          <Tooltip title={<T id="page.monitor.server.refresh" />}>
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
          <ProCard title={<T id="page.monitor.server.info" />}>
            <Row gutter={[12, 24]} wrap>
              <Col span={24}>
                <Statistic.Timer
                  type="countup"
                  value={new Date().getTime() - info?.node?.uptime * 1000}
                  title={<T id="page.monitor.server.runTime" />}
                  format={t('page.monitor.server.runTime.format')}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<T id="page.monitor.server.ip" />}
                  value={`${info?.sys?.computerIp}`}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<T id="page.monitor.server.os" />}
                  value={`${info?.sys?.osName}`}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<T id="page.monitor.server.platform" />}
                  value={`${info?.node?.title}`}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<T id="page.monitor.server.version" />}
                  value={`${info?.node?.version}`}
                />
              </Col>
            </Row>
          </ProCard>
          <ProCard
            title={<T id="page.monitor.server.resource" />}
            split="horizontal"
          >
            <StatisticCard
              statistic={{
                title: <T id="page.monitor.server.cpu" />,
                value: cpuUsage,
                suffix: '%',
                description: (
                  <>
                    <StatisticCard.Statistic
                      layout="inline"
                      title={<T id="page.monitor.server.cpu.user" />}
                      value={`${cpuUsed}%`}
                    />
                    <StatisticCard.Statistic
                      layout="inline"
                      title={<T id="page.monitor.server.cpu.sys" />}
                      value={`${cpuSys}%`}
                    />
                  </>
                ),
              }}
              chart={
                <Progress
                  percent={cpuUsage}
                  showInfo={false}
                  strokeLinecap="butt"
                  size={{ height: 10 }}
                />
              }
            />
            <StatisticCard
              statistic={{
                title: <T id="page.monitor.server.mem" />,
                value: info?.mem?.usage,
                suffix: '%',
                description: (
                  <>
                    <StatisticCard.Statistic
                      title={<T id="page.monitor.server.mem.total" />}
                      value={`${info?.mem?.total}GB`}
                    />
                    <StatisticCard.Statistic
                      layout="horizontal"
                      title={<T id="page.monitor.server.mem.used" />}
                      value={`${info?.mem?.used}GB`}
                    />
                  </>
                ),
              }}
              chart={
                <Progress
                  percent={info?.mem?.usage}
                  showInfo={false}
                  strokeLinecap="butt"
                  size={{ height: 10 }}
                />
              }
            />
          </ProCard>
        </ProCard>
        <ProCard title={<T id="page.monitor.server.disk" />}>
          <DiskList list={info?.sysFiles} />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
