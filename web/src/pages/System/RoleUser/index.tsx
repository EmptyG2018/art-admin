import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Divider,
  Space,
  Tooltip,
  message,
  Dropdown,
  Popconfirm,
  Modal,
} from 'antd';
import {
  ExportOutlined,
  EllipsisOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { getAllocatedUserList } from '@/services/user';
import {
  getRole,
  updateUnAuthUser,
  updateUnAuthBatchUser,
} from '@/services/role';
import { columns as userColumns } from './components/SelectAllocatedUser';
import SelectAllocatedUser from './components/SelectAllocatedUser';

export const Component: React.FC<unknown> = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const descriptionsColumns: ProColumns[] = [
    {
      title: '字典名称',
      dataIndex: 'roleName',
      valueType: 'text',
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'radio',
      request: async () => {
        const res = await queryDictsByType('sys_normal_disable');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
    },
  ];

  const columns: ProColumns[] = [
    ...userColumns,
    {
      title: '操作',
      width: 60,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space
          direction="horizontal"
          split={<Divider type="vertical" />}
          size={2}
        >
          <Tooltip title="取消授权">
            <Popconfirm
              title="取消授权"
              description="您确定要取消该用户的授权吗？"
              onConfirm={async () => {
                const hide = message.loading('正在取消授权');
                try {
                  await updateUnAuthUser({
                    userId: record.userId,
                    roleId,
                  })
                  hide();
                  message.success('取消授权成功');
                  actionRef.current?.reloadAndRest?.();
                  return true;
                } catch {
                  hide();
                  message.error('取消授权失败请重试!');
                  return false;
                }
              }}
            >
              <Button type="link" size="small" icon={<MinusCircleOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '授权用户',
      }}
      content={
        <ProDescriptions
          columns={descriptionsColumns}
          column={{ sm: 1, md: 2, lg: 2, xl: 2 }}
          request={async () => {
            const res = await getRole(roleId);
            return { success: true, data: res.data };
          }}
        />
      }
      onBack={() => navigate(-1)}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="userId"
        toolBarRender={() => [
          <SelectAllocatedUser
            roleId={roleId}
            trigger={
              <Button type="primary" icon={<PlusOutlined />} key="add">
                新建
              </Button>
            }
            onFinish={() => {
              actionRef.current?.reload();
            }}
          />,

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
          const { code, rows, total } = await getAllocatedUserList({
            roleId,
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
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        scroll={{ x: 1200 }}
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
                  const hide = message.loading('正在取消授权');
                  if (!selectedRowsState) return true;
                  try {
                    await updateUnAuthBatchUser({
                      userIds: selectedRowsState.map(row => row.userId).join(','),
                      roleId,
                    })
                    hide();
                    message.success('取消授权成功');
                    actionRef.current?.reloadAndRest?.();
                    Promise.resolve();
                  } catch {
                    hide();
                    message.error('取消授权失败请重试!');
                    Promise.reject();
                  }
                },
              });
            }}
          >
            批量取消授权
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};
