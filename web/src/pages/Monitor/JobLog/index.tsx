import React, { useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Modal, message } from 'antd';
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
import { PermissionGuard } from '@/components/Layout';
import { rawT, useT, T } from '@/locales';
import { queryDictsByType } from '@/services/dict';
import { queryJobLogPage, cleanJobLog } from '@/services/monitor';

export const Component: React.FC<unknown> = () => {
  const t = useT();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns[] = [
    {
      title: <T id="page.job.field.logId" />,
      dataIndex: 'jobLogId',
      width: 140,
      hideInSearch: true,
    },
    {
      title: <T id="page.job.field.jobName" />,
      dataIndex: 'jobName',
      valueType: 'text',
      width: 180,
      initialValue: searchParams.get('jobName'),
    },
    {
      title: <T id="page.job.field.jobGroup" />,
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
      title: <T id="page.job.field.jobFun" />,
      dataIndex: 'invokeTarget',
      valueType: 'text',
      width: 320,
      hideInSearch: true,
    },
    {
      title: <T id="component.field.status" />,
      dataIndex: 'status',
      valueType: 'select',
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
      title: <T id="page.job.field.log" />,
      dataIndex: 'jobMessage',
      valueType: 'text',
      width: 240,
      hideInSearch: true,
    },

    {
      title: <T id="page.job.field.operTime" />,
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
        headerTitle={<T id="component.table.title" />}
        actionRef={actionRef}
        rowKey="jobLogId"
        toolBarRender={() => [
          <PermissionGuard requireds={['monitor:job:remove']}>
            <Button
              icon={<ClearOutlined />}
              key="clear"
              onClick={() => {
                Modal.confirm({
                  title: t('component.confirm.clear'),
                  content: t('component.confirm.clear.desc'),
                  onOk: async () => {
                    const hide = message.loading(
                      t('component.form.message.delete.loading'),
                    );
                    try {
                      await cleanJobLog();
                      hide();
                      message.success(
                        t('component.form.message.delete.success'),
                      );
                      actionRef.current?.reloadAndRest?.();
                      Promise.resolve();
                    } catch {
                      hide();
                      message.error(t('component.form.message.delete.error'));
                      Promise.reject();
                    }
                  },
                });
              }}
            >
              <T id="page.job.log.clear" />
            </Button>
          </PermissionGuard>,
          <Dropdown
            menu={{
              items: [
                {
                  label: <T id="component.table.tool.export" />,
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
          defaultPageSize: 12,
        }}
        scroll={{ x: 1200 }}
      />
    </PageContainer>
  );
};
