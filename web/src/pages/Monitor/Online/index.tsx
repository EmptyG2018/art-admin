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
import { queryOnlinePage, deleteOnline } from '@/services/monitor';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在操作');
  if (!selectedRows) return true;
  try {
    await deleteOnline(selectedRows.map((row) => row.tokenId).join(','));
    hide();
    message.success('操作成功');
    return true;
  } catch {
    hide();
    message.error('操作失败请重试!');
    return false;
  }
};

export const Component: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: '访问编号',
      dataIndex: 'tokenId',
      width: 220,
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      valueType: 'text',
      width: 180,
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'ipaddr',
      valueType: 'text',
      width: 180,
    },
    {
      title: '登录地址',
      dataIndex: 'loginLocation',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      valueType: 'dateTime',
      width: 220,
    },
    {
      title: '操作',
      width: 60,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <PermissionGuard requireds={['monitor:online:forceLogout']}>
            <Tooltip title="踢出">
              <Popconfirm
                title="提示"
                description="确定要踢出此用户的登录吗？"
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
        headerTitle="查询表格"
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
