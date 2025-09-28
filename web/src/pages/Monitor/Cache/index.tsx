'use client';
import {
  Row,
  Col,
  Card,
  Statistic,
  Tag,
  Progress,
  Space,
  Typography,
  Divider,
} from 'antd';
import {
  DatabaseOutlined,
  ClusterOutlined,
  UserOutlined,
  ClockCircleOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
// import ReactECharts from 'echarts-for-react';
// import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const Component = () => {
  // Redis监控数据
  const redisData = {
    version: '7.2.4',
    mode: '单机',
    port: 6379,
    clients: 21,
    uptime: 353, // 天
    memoryUsed: 2.93, // MB
    cpuUsage: 170.52,
    memoryConfig: 0, // B
    aofEnabled: false,
    rdbStatus: 'ok',
    keyCount: 32,
    networkIn: 1.9, // kps
    networkOut: 0.06, // kps
  };

  // 内存使用趋势图配置
  const memoryTrendOption = {
    title: {
      text: '内存使用趋势',
      textStyle: { fontSize: 14, fontWeight: 'normal' },
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} MB',
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    },
    yAxis: {
      type: 'value',
      name: 'MB',
    },
    series: [
      {
        data: [2.1, 2.3, 2.8, 2.9, 2.7, 2.9, 2.93],
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.3,
        },
        itemStyle: {
          color: '#1890ff',
        },
      },
    ],
  };

  // CPU使用率图配置
  const cpuUsageOption = {
    title: {
      text: 'CPU使用率',
      textStyle: { fontSize: 14, fontWeight: 'normal' },
    },
    tooltip: {
      formatter: '{a}: {c}%',
    },
    series: [
      {
        name: 'CPU使用率',
        type: 'gauge',
        min: 0,
        max: 200,
        splitNumber: 10,
        radius: '80%',
        axisLine: {
          lineStyle: {
            width: 10,
            color: [
              [0.3, '#67e0e3'],
              [0.7, '#37a2da'],
              [1, '#fd666d'],
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: {
          distance: -30,
          length: 8,
          lineStyle: {
            color: '#fff',
            width: 2,
          },
        },
        splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            color: '#fff',
            width: 4,
          },
        },
        axisLabel: {
          color: 'auto',
          distance: 40,
          fontSize: 12,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: 'auto',
          fontSize: 16,
        },
        data: [
          {
            value: redisData.cpuUsage,
            name: 'CPU',
          },
        ],
      },
    ],
  };

  // 网络流量图配置
  const networkOption = {
    title: {
      text: '网络流量',
      textStyle: { fontSize: 14, fontWeight: 'normal' },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => `${params[0].axisValue}<br/>
                入口: ${params[0].value} kps<br/>
                出口: ${params[1].value} kps`,
    },
    legend: {
      data: ['入口', '出口'],
      bottom: 0,
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    },
    yAxis: {
      type: 'value',
      name: 'kps',
    },
    series: [
      {
        name: '入口',
        type: 'bar',
        data: [1.2, 1.5, 1.8, 1.9, 1.7, 1.8, 1.9],
        itemStyle: { color: '#52c41a' },
      },
      {
        name: '出口',
        type: 'bar',
        data: [0.03, 0.04, 0.05, 0.06, 0.05, 0.05, 0.06],
        itemStyle: { color: '#faad14' },
      },
    ],
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* 基础信息卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Redis版本"
              value={redisData.version}
              prefix={<DatabaseOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="运行模式"
              value={redisData.mode}
              prefix={<ClusterOutlined style={{ color: '#52c41a' }} />}
            />
            <Text type="secondary">端口: {redisData.port}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="客户端连接"
              value={redisData.clients}
              prefix={<UserOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="运行时间"
              value={redisData.uptime}
              suffix="天"
              prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 性能指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card
            title={
              <>
                x 内存使用
              </>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic
                title="当前使用"
                value={redisData.memoryUsed}
                suffix="MB"
                precision={2}
              />
              <Progress
                percent={Math.round((redisData.memoryUsed / 10) * 100)}
                status="active"
                strokeColor="#1890ff"
              />
              <Text type="secondary">
                配置: {redisData.memoryConfig}B (无限制)
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title={
              <>
                x CPU使用率
              </>
            }
          >
            <Statistic
              title="当前CPU"
              value={redisData.cpuUsage}
              suffix="%"
              precision={2}
              valueStyle={{
                color: redisData.cpuUsage > 100 ? '#cf1322' : '#3f8600',
              }}
            />
            <Progress
              percent={Math.min(redisData.cpuUsage, 200)}
              status={redisData.cpuUsage > 100 ? 'exception' : 'active'}
              strokeColor={redisData.cpuUsage > 100 ? '#ff4d4f' : '#52c41a'}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title={
              <>
                <KeyOutlined /> 数据统计
              </>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic
                title="Key数量"
                value={redisData.keyCount}
                prefix={<KeyOutlined />}
              />
              <Divider style={{ margin: '12px 0' }} />
              <Space>
                <Text strong>网络流量:</Text>
              </Space>
              <Space direction="vertical" size="small">
                <Text>
                  x 入口: {redisData.networkIn} kps
                </Text>
                <Text>
                  x 出口: {redisData.networkOut} kps
                </Text>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 持久化状态 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Card title="持久化配置">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Text strong>AOF (Append Only File):</Text>
                <Tag
                  color={redisData.aofEnabled ? 'green' : 'red'}
                  icon={
                    redisData.aofEnabled ? (
                      <CheckCircleOutlined />
                    ) : (
                      <CloseCircleOutlined />
                    )
                  }
                >
                  {redisData.aofEnabled ? '已开启' : '未开启'}
                </Tag>
              </Space>
              <Space>
                <Text strong>RDB (Redis Database):</Text>
                <Tag
                  color={redisData.rdbStatus === 'ok' ? 'green' : 'red'}
                  icon={<CheckCircleOutlined />}
                >
                  {redisData.rdbStatus === 'ok' ? '正常' : '异常'}
                </Tag>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="系统信息">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>
                <strong>启动时间:</strong>{' '}
                {/* {dayjs()
                  .subtract(redisData.uptime, 'day')
                  .format('YYYY-MM-DD HH:mm:ss')} */}
              </Text>
              <Text>
                <strong>配置文件:</strong> /etc/redis/redis.conf
              </Text>
              <Text>
                <strong>数据目录:</strong> /var/lib/redis
              </Text>
              <Text>
                <strong>日志级别:</strong> notice
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card>
            {/* <ReactECharts
              option={memoryTrendOption}
              style={{ height: '300px' }}
            /> */}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            {/* <ReactECharts option={cpuUsageOption} style={{ height: '300px' }} /> */}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            {/* <ReactECharts option={networkOption} style={{ height: '300px' }} /> */}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
