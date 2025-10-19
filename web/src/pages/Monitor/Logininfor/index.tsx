import React, { useRef, useState } from 'react';
import { Button, message, Dropdown, Modal } from 'antd';
import {
  ExportOutlined,
  EllipsisOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { PermissionGuard } from '@/components/Layout';
import { rawT, useT, T } from '@/locales';
import { queryDictsByType } from '@/services/dict';
import {
  queryLogininforPage,
  deleteLogininfor,
  cleanLogininfor,
} from '@/services/log';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading(rawT('component.form.message.delete.loading'));
  if (!selectedRows) return true;
  try {
    await deleteLogininfor(selectedRows.map((row) => row.infoId).join(','));
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
      title: <T id="page.logininfor.field.id" />,
      dataIndex: 'infoId',
      width: 140,
      hideInSearch: true,
    },
    {
      title: <T id="page.logininfor.field.userName" />,
      dataIndex: 'userName',
      valueType: 'text',
      width: 180,
    },
    {
      title: <T id="page.logininfor.field.ip" />,
      dataIndex: 'ipaddr',
      valueType: 'text',
      width: 180,
    },
    {
      title: <T id="page.logininfor.field.location" />,
      dataIndex: 'loginLocation',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: <T id="page.logininfor.field.os" />,
      dataIndex: 'os',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: <T id="page.logininfor.field.brower" />,
      dataIndex: 'browser',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: <T id="page.logininfor.field.status" />,
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
      title: <T id="page.logininfor.field.loginTime" />,
      dataIndex: 'loginTime',
      valueType: 'dateTime',
      width: 220,
    },
  ];

  return (
    <PageContainer
      header={{
        title: '登录日志',
      }}
    >
      <ProTable
        headerTitle={<T id="component.table.title" />}
        actionRef={actionRef}
        rowKey="infoId"
        toolBarRender={() => [
          <PermissionGuard requireds={['monitor:logininfor:remove']}>
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
                      await cleanLogininfor();
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
              <T id="page.logininfor.clear" />
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
          const { code, rows, total } = await queryLogininforPage({
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
          <PermissionGuard requireds={['monitor:logininfor:remove']}>
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
