import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  App,
  Button,
  Space,
  message,
  Dropdown,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
} from 'antd';
import {
  ExportOutlined,
  EllipsisOutlined,
  PlusOutlined,
  CaretRightOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProTable,
  ProColumns,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
} from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { queryJobPage, deleteJob, runJob } from '@/services/monitor';
import { CronSelect } from '@/components';
import CreateJobForm from './components/CreateJobForm';
import UpdateJobForm from './components/UpdateJobForm';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteJob(selectedRows.map((row) => row.jobId).join(','));
    hide();
    message.success('删除成功');
    return true;
  } catch {
    hide();
    message.error('删除失败请重试!');
    return false;
  }
};

export const Component: React.FC<unknown> = () => {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const columns: ProColumns[] = [
    {
      title: '任务编号',
      dataIndex: 'jobId',
      hideInSearch: true,
      hideInForm: true,
      width: 140,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      valueType: 'text',
      width: 180,
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      valueType: 'select',
      width: 180,
      request: async () => {
        const res = await queryDictsByType('sys_job_group');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: '调用函数',
      dataIndex: 'invokeTarget',
      valueType: 'text',
      width: 320,
      hideInSearch: true,
    },
    {
      title: 'cron表达式',
      dataIndex: 'cronExpression',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_job_status');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 220,
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <Tooltip title="执行一次">
            <Popconfirm
              title="提示"
              description="您确定要执行一次此任务吗？"
              onConfirm={async () => {
                const hide = message.loading('正在执行');
                try {
                  await runJob({
                    jobId: record.jobId,
                    jobGroup: record.jobGroup,
                  });
                  hide();
                  message.success('执行成功');
                  return true;
                } catch {
                  hide();
                  message.error('执行失败请重试!');
                  return false;
                }
              }}
            >
              <Button type="link" size="small" icon={<CaretRightOutlined />} />
            </Popconfirm>
          </Tooltip>
          <UpdateJobForm
            values={record}
            formRender={formRender}
            trigger={
              <Tooltip title="修改">
                <Button type="link" size="small" icon={<EditOutlined />} />
              </Tooltip>
            }
            onFinish={() => {
              actionRef.current?.reload();
            }}
          />
          <Tooltip title="调度日志">
            <Link
              to={`../job/log?jobName=${record.jobName}&jobGroup=${record.jobGroup}`}
            >
              <Button type="link" size="small" icon={<ClockCircleOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="删除记录"
              description="您确定要删除此记录吗？"
              onConfirm={async () => {
                await handleRemove([record]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              <Button type="link" size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const formRender = (
    <>
      <ProFormText
        name="jobName"
        label="任务名称"
        placeholder="请输入任务名称"
        rules={[{ required: true, message: '请输入任务名称' }]}
        width="md"
      />
      <ProFormSelect
        name="jobGroup"
        label="任务组名"
        placeholder="请选择任务组名"
        request={async () => {
          const res = await queryDictsByType('sys_job_group');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
        rules={[{ required: true, message: '请选择任务组名' }]}
        width="md"
      />
      <ProFormText
        name="invokeTarget"
        label="调用函数"
        placeholder="请输入调用函数"
        rules={[{ required: true, message: '请输入调用函数' }]}
        width="md"
      />
      <Form.Item
        name="cronExpression"
        label="cron表达式"
        initialValue="* * * * *"
        rules={[{ required: true, message: '请输入cron表达式' }]}
      >
        <CronSelect />
      </Form.Item>
      <ProFormRadio.Group
        radioType="button"
        name="misfirePolicy"
        label="执行策略"
        placeholder="请选择执行策略"
        initialValue="1"
        valueEnum={{
          '1': { text: '立即执行' },
          '2': { text: '执行一次' },
          '3': { text: '放弃执行' },
        }}
      />
      <ProFormRadio.Group
        name="concurrent"
        label="是否并发"
        placeholder="请选择是否并发"
        initialValue="1"
        valueEnum={{
          '0': { text: '允许' },
          '1': { text: '禁止' },
        }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        placeholder="请选择状态"
        initialValue="0"
        request={async () => {
          const res = await queryDictsByType('sys_job_status');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
      />
    </>
  );

  return (
    <PageContainer
      header={{
        title: '定时任务',
      }}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="jobId"
        toolBarRender={() => [
          <CreateJobForm
            formRender={formRender}
            trigger={
              <Button type="primary" icon={<PlusOutlined />} key="add">
                新建
              </Button>
            }
            onFinish={() => {
              actionRef.current?.reload();
            }}
          />,
          <Link to="../job/log">
            <Button icon={<ClockCircleOutlined />} key="log">
              调度日志
            </Button>
          </Link>,

          <Dropdown
            menu={{
              items: [
                {
                  label: '导出',
                  icon: <ExportOutlined />,
                  key: 'export',
                },
              ],
            }}
            key="menu"
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
        request={async (params, sorter, filter) => {
          const { code, rows, total } = await queryJobPage({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: rows,
            total,
            success: code === 200,
          };
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 12,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        scroll={{ x: 1400 }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              Modal.confirm({
                title: '删除记录',
                content: '您确定要删除选中的记录吗？',
                onOk: async () => {
                  const ok = await handleRemove(selectedRowsState);
                  if (ok) {
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                    Promise.resolve();
                  } else {
                    Promise.reject();
                  }
                },
              });
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};
