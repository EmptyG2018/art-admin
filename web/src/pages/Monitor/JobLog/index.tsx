import React, { useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Modal } from 'antd';
import {
  ExportOutlined,
  EllipsisOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { queryJobLogPage, cleanJobLog } from '@/services/monitor';

export const Component: React.FC<unknown> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: '日志编号',
      dataIndex: 'jobLogId',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      valueType: 'text',
      width: 180,
      initialValue: searchParams.get('jobName'),
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      valueType: 'select',
      width: 180,
      initialValue: searchParams.get('jobGroup'),
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
      title: '日志信息',
      dataIndex: 'jobMessage',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'radio',
      initialValue: '0',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_common_status');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: '执行时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 220,
    },
  ];

  return (
    <PageContainer
      header={{
        title: '调度日志',
      }}
      onBack={() => navigate(-1)}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="jobLogId"
        toolBarRender={() => [
          <Button
            icon={<ClearOutlined />}
            key="clear"
            onClick={() => {
              Modal.confirm({
                title: '删除记录',
                content: '您确定要清空全部记录吗？',
                onOk: async () => {
                  try {
                    await cleanJobLog();
                    actionRef.current?.reloadAndRest?.();
                    Promise.resolve();
                  } catch {
                    Promise.reject();
                  }
                },
              });
            }}
          >
            清空
          </Button>,

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
          const { code, rows, total } = await queryJobLogPage({
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
          current: 1,
          pageSize: 15,
        }}
        scroll={{ x: 1200 }}
      />
    </PageContainer>
  );
};
