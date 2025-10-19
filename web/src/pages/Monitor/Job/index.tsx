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
import { PermissionGuard } from '@/components/Layout';
import { rawT, useT, T } from '@/locales';
import { CronSelect } from '@/components';
import CreateJobForm from './components/CreateJobForm';
import UpdateJobForm from './components/UpdateJobForm';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading(rawT('component.form.message.delete.loading'));
  if (!selectedRows) return true;
  try {
    await deleteJob(selectedRows.map((row) => row.jobId).join(','));
    hide();
    message.success(rawT('component.form.message.delete.success'));
    return true;
  } catch {
    hide();
    message.success(rawT('component.form.message.delete.error'));
    return false;
  }
};

export const Component: React.FC<unknown> = () => {
  const t = useT();
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const columns: ProColumns[] = [
    {
      title: <T id="page.job.field.id" />,
      dataIndex: 'jobId',
      hideInSearch: true,
      hideInForm: true,
      width: 140,
    },
    {
      title: <T id="page.job.field.jobName" />,
      dataIndex: 'jobName',
      valueType: 'text',
      width: 180,
    },
    {
      title: <T id="page.job.field.jobGroup" />,
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
      title: <T id="page.job.field.jobFun" />,
      dataIndex: 'invokeTarget',
      valueType: 'text',
      width: 320,
      hideInSearch: true,
    },
    {
      title: <T id="page.job.field.cron" />,
      dataIndex: 'cronExpression',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: <T id="component.field.status" />,
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
      title: <T id="component.field.createTime" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 220,
    },
    {
      title: <T id="component.table.action" />,
      width: 180,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <PermissionGuard requireds={['monitor:job:edit']}>
            <Tooltip title={<T id="page.job.run.one" />}>
              <Popconfirm
                title={<T id="component.confirm.title" />}
                description={<T id="page.job.run.one.confirmMessage" />}
                onConfirm={async () => {
                  const hide = message.loading(
                    t('page.job.message.run.loading'),
                  );
                  try {
                    await runJob({
                      jobId: record.jobId,
                      jobGroup: record.jobGroup,
                    });
                    hide();
                    message.success(t('page.job.message.run.success'));
                    return true;
                  } catch {
                    hide();
                    message.error(t('page.job.message.run.error'));
                    return false;
                  }
                }}
              >
                <Button
                  type="link"
                  size="small"
                  icon={<CaretRightOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </PermissionGuard>
          <PermissionGuard requireds={['monitor:job:edit']}>
            <UpdateJobForm
              values={record}
              formRender={formRender}
              trigger={
                <Tooltip title={<T id="component.tooltip.update" />}>
                  <Button type="link" size="small" icon={<EditOutlined />} />
                </Tooltip>
              }
              onFinish={() => {
                actionRef.current?.reload();
              }}
            />
          </PermissionGuard>
          <Tooltip title={<T id="page.job.log" />}>
            <Link
              to={`../job/log?jobName=${record.jobName}&jobGroup=${record.jobGroup}`}
            >
              <Button type="link" size="small" icon={<ClockCircleOutlined />} />
            </Link>
          </Tooltip>
          <PermissionGuard requireds={['monitor:job:remove']}>
            <Tooltip title={<T id="component.tooltip.delete" />}>
              <Popconfirm
                title={<T id="component.confirm.delete" />}
                description={<T id="component.confirm.delete.desc" />}
                onConfirm={async () => {
                  await handleRemove([record]);
                  actionRef.current?.reloadAndRest?.();
                }}
              >
                <Button type="link" size="small" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  const formRender = (
    <>
      <ProFormText
        name="jobName"
        label={<T id="page.job.field.jobName" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.job.field.jobName'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.job.field.jobName'),
            }),
          },
        ]}
        width="md"
      />
      <ProFormSelect
        name="jobGroup"
        label={<T id="page.job.field.jobGroup" />}
        placeholder={t('component.form.placeholder.sel', {
          label: t('page.job.field.jobGroup'),
        })}
        request={async () => {
          const res = await queryDictsByType('sys_job_group');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.job.field.jobGroup'),
            }),
          },
        ]}
        width="md"
      />
      <ProFormText
        name="invokeTarget"
        label={<T id="page.job.field.jobFun" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.job.field.jobFun'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.job.field.jobFun'),
            }),
          },
        ]}
        width="md"
      />
      <Form.Item
        name="cronExpression"
        label={<T id="page.job.field.cron" />}
        initialValue="* * * * *"
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.job.field.cron'),
            }),
          },
        ]}
      >
        <CronSelect />
      </Form.Item>
      <ProFormRadio.Group
        radioType="button"
        name="misfirePolicy"
        label={<T id="page.job.field.run" />}
        placeholder={t('component.form.placeholder.sel', {
          label: t('page.job.field.run'),
        })}
        initialValue="1"
        valueEnum={{
          '1': { text: <T id="page.job.run.immediate" /> },
          '2': { text: <T id="page.job.run.one" /> },
          '3': { text: <T id="page.job.run.quit" /> },
        }}
      />
      <ProFormRadio.Group
        name="concurrent"
        label={<T id="page.job.field.isConcurrent" />}
        placeholder={t('component.form.placeholder.sel', {
          label: t('page.job.field.isConcurrent'),
        })}
        initialValue="1"
        valueEnum={{
          '0': { text: <T id="page.job.concurrent.true" /> },
          '1': { text: <T id="page.job.concurrent.false" /> },
        }}
      />
      <ProFormRadio.Group
        name="status"
        label={<T id="component.field.status" />}
        placeholder={t('component.field.status.placeholder')}
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
        headerTitle={<T id="component.table.title" />}
        actionRef={actionRef}
        rowKey="jobId"
        toolBarRender={() => [
          <PermissionGuard requireds={['monitor:job:add']}>
            <CreateJobForm
              formRender={formRender}
              trigger={
                <Button type="primary" icon={<PlusOutlined />} key="add">
                  <T id="component.table.tool.add" />
                </Button>
              }
              onFinish={() => {
                actionRef.current?.reload();
              }}
            />
          </PermissionGuard>,
          <Link to="../job/log">
            <Button icon={<ClockCircleOutlined />} key="log">
              <T id="page.job.log" />
            </Button>
          </Link>,

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
              <T
                id="component.table.selection"
                values={{
                  num: (
                    <a style={{ fontWeight: 600 }}>
                      {selectedRowsState.length}
                    </a>
                  ),
                }}
              />
            </div>
          }
        >
          <PermissionGuard requireds={['monitor:job:remove']}>
            <Button
              onClick={async () => {
                Modal.confirm({
                  title: t('component.confirm.delete'),
                  content: t('component.confirm.delete.desc'),
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
              <T id="component.table.tool.batchdelete" />
            </Button>
          </PermissionGuard>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};
