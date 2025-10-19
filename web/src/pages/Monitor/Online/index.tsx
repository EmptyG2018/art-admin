import React, { useRef } from 'react';
import { Button, Space, message, Tooltip, Popconfirm } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { PermissionGuard } from '@/components/Layout';
import { rawT, useT, T } from '@/locales';
import { queryOnlinePage, deleteOnline } from '@/services/monitor';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading(rawT('page.online.message.logout.loading'));
  if (!selectedRows) return true;
  try {
    await deleteOnline(selectedRows.map((row) => row.tokenId).join(','));
    hide();
    message.success(rawT('page.online.message.logout.success'));
    return true;
  } catch {
    hide();
    message.success(rawT('page.online.message.logout.error'));
    return false;
  }
};

export const Component: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: <T id="page.online.field.id" />,
      dataIndex: 'tokenId',
      width: 220,
      hideInSearch: true,
    },
    {
      title: <T id="page.online.field.user" />,
      dataIndex: 'userName',
      valueType: 'text',
      width: 180,
    },
    {
      title: <T id="page.online.field.deptName" />,
      dataIndex: 'deptName',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: <T id="page.online.field.ip" />,
      dataIndex: 'ipaddr',
      valueType: 'text',
      width: 180,
    },
    {
      title: <T id="page.online.field.location" />,
      dataIndex: 'loginLocation',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: <T id="page.online.field.os" />,
      dataIndex: 'os',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: <T id="page.online.field.brower" />,
      dataIndex: 'browser',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: <T id="page.online.field.loginTime" />,
      dataIndex: 'loginTime',
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
          <PermissionGuard requireds={['monitor:online:forceLogout']}>
            <Tooltip title={<T id="page.online.logout" />}>
              <Popconfirm
                title={<T id="page.online.logout" />}
                description={<T id="page.online.logout.confirmMessage" />}
                onConfirm={async () => {
                  await handleRemove([record]);
                  actionRef.current?.reloadAndRest?.();
                }}
              >
                <Button type="link" size="small" icon={<LogoutOutlined />} />
              </Popconfirm>
            </Tooltip>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '在线用户',
      }}
    >
      <ProTable
        headerTitle={<T id="component.table.title" />}
        actionRef={actionRef}
        rowKey="infoId"
        request={async (params, sorter, filter) => {
          const { code, rows, total } = await queryOnlinePage({
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
        pagination={false}
        scroll={{ x: 1400 }}
      />
    </PageContainer>
  );
};
