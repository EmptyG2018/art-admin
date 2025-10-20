import React, { useRef, useState } from 'react';
import { Button, Space, message, Dropdown, Tooltip, Modal } from 'antd';
import {
  ExportOutlined,
  EllipsisOutlined,
  EyeOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { queryOperlogPage, deleteOperlog, cleanOperlog } from '@/services/log';
import { PermissionGuard } from '@/components/Layout';
import { rawT, useT, T } from '@/locales';
import ViewOperlog from './components/ViewOperlog';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading(rawT('component.form.message.delete.loading'));
  if (!selectedRows) return true;
  try {
    await deleteOperlog(selectedRows.map((row) => row.operId).join(','));
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
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const columns: ProColumns[] = [
    {
      title: <T id="page.operlog.field.id" />,
      dataIndex: 'operId',
      hideInSearch: true,
      width: 140,
    },
    {
      title: <T id="page.operlog.field.module" />,
      dataIndex: 'title',
      valueType: 'text',
      width: 180,
    },
    {
      title: <T id="page.operlog.field.method" />,
      dataIndex: 'businessType',
      valueType: 'select',
      width: 180,
      request: async () => {
        const res = await queryDictsByType('sys_oper_type');
        return res.data.map((dict) => ({
          label: dict.i18nKey ? t(dict.i18nKey) : dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: <T id="page.operlog.field.operBy" />,
      dataIndex: 'operName',
      valueType: 'text',
      width: 180,
    },
    {
      title: <T id="page.operlog.field.ip" />,
      dataIndex: 'operIp',
      valueType: 'text',
      width: 180,
    },
    {
      title: <T id="page.operlog.field.operStatus" />,
      dataIndex: 'status',
      valueType: 'select',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_common_status');
        return res.data.map((dict) => ({
          label: dict.i18nKey ? t(dict.i18nKey) : dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: <T id="page.operlog.field.timer" />,
      dataIndex: 'costTime',
      valueType: 'text',
      hideInSearch: true,
      width: 120,
    },
    {
      title: <T id="page.operlog.field.operTime" />,
      dataIndex: 'operTime',
      valueType: 'dateTime',
      width: 220,
    },
    {
      title: <T id="component.table.action" />,
      width: 60,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <ViewOperlog
            values={record}
            trigger={
              <Tooltip title={<T id="component.tooltip.detail" />}>
                <Button type="link" size="small" icon={<EyeOutlined />} />
              </Tooltip>
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: <T id="menu.log.operlog" />,
      }}
    >
      <ProTable
        headerTitle={<T id="component.table.title" />}
        actionRef={actionRef}
        rowKey="operId"
        toolBarRender={() => [
          <PermissionGuard requireds={['monitor:operlog:remove']}>
            <Button
              icon={<ClearOutlined />}
              key="clear"
              onClick={() => {
                Modal.confirm({
                  title: t('component.confirm.delete'),
                  content: t('component.confirm.delete.desc'),
                  onOk: async () => {
                    const hide = message.loading(
                      t('component.form.message.delete.loading'),
                    );
                    try {
                      await cleanOperlog();
                      hide();
                      message.success(
                        t('component.form.message.delete.success'),
                      );
                      actionRef.current?.reloadAndRest?.();
                      Promise.resolve();
                    } catch {
                      hide();
                      message.error(t('component.form.message.delete.loading'));
                      Promise.reject();
                    }
                  },
                });
              }}
            >
              <T id="page.operlog.clear" />
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
          const { code, rows, total } = await queryOperlogPage({
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
          <PermissionGuard requireds={['monitor:operlog:remove']}>
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
