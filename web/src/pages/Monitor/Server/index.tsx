import { Tooltip, Button, Statistic, Row, Col, Progress, Spin } from 'antd';
import { DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  StatisticCard,
} from '@ant-design/pro-components';
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
              已使用 {disk.used} GB ，共 {disk.total} GB
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Component = () => {
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
        title="服务监控"
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
          <ProCard title="服务器信息">
            <Row gutter={[12, 24]} wrap>
              <Col span={24}>
                <Statistic.Timer
                  type="countup"
                  value={new Date().getTime() - info?.node?.uptime * 1000}
                  title="已运行时长"
                  format="D 天 HH 时 mm 分 ss 秒"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="服务器IP"
                  value={`${info?.sys?.computerIp}`}
                />
              </Col>
              <Col span={12}>
                <Statistic title="操作系统" value={`${info?.sys?.osName}`} />
              </Col>
              <Col span={12}>
                <Statistic title="服务平台" value={`${info?.node?.title}`} />
              </Col>
              <Col span={12}>
                <Statistic
                  title="服务平台版本"
                  value={`${info?.node?.version}`}
                />
              </Col>
            </Row>
          </ProCard>
          <ProCard title="资源消耗" split="horizontal">
            <StatisticCard
              statistic={{
                title: 'CPU占用比率',
                value: cpuUsage,
                suffix: '%',
                description: (
                  <>
                    <StatisticCard.Statistic
                      layout="inline"
                      title="用户占用比率"
                      value={`${cpuUsed}%`}
                    />
                    <StatisticCard.Statistic
                      layout="inline"
                      title="系统占用比率"
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
                title: '内存占用比率',
                value: 20.3,
                suffix: '%',
                description: (
                  <>
                    <StatisticCard.Statistic
                      title="总内存"
                      value={`${info?.mem?.total}GB`}
                    />
                    <StatisticCard.Statistic
                      layout="horizontal"
                      title="已占用"
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
        <ProCard title="磁盘状态">
          <DiskList list={info?.sysFiles} />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
