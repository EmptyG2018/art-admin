import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
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
import { rawT, useT, T } from '@/locales';
import { columns as userColumns } from './components/SelectAllocatedUser';
import SelectAllocatedUser from './components/SelectAllocatedUser';

export const Component: React.FC<unknown> = () => {
  const t = useT();
  const { roleId } = useParams();
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const descriptionsColumns: ProColumns[] = [
    {
      title: <T id="page.role.field.roleName" />,
      dataIndex: 'roleName',
      valueType: 'text',
    },
    {
      title: <T id="page.role.field.authKey" />,
      dataIndex: 'roleKey',
      valueType: 'text',
    },
    {
      title: <T id="component.field.status" />,
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
      title: <T id="component.field.remark" />,
      dataIndex: 'remark',
      valueType: 'textarea',
    },
  ];

  const columns: ProColumns[] = [
    ...userColumns,
    {
      title: <T id="component.table.action" />,
      width: 60,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <Tooltip title={<T id="page.role.cancelAuth" />}>
            <Popconfirm
              title={<T id="page.role.cancelAuth" />}
              description={<T id="page.role.cancelAuth.desc" />}
              onConfirm={async () => {
                const hide = message.loading(t('page.role.cancelAuth.loading'));
                try {
                  await updateUnAuthUser({
                    userId: record.userId,
                    roleId,
                  });
                  hide();
                  message.success(t('page.role.cancelAuth.success'));
                  actionRef.current?.reloadAndRest?.();
                  return true;
                } catch {
                  hide();
                  message.error(t('page.role.cancelAuth.error'));
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
        title: '用户授权',
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
        headerTitle={<T id="component.table.title" />}
        actionRef={actionRef}
        rowKey="userId"
        toolBarRender={() => [
          <SelectAllocatedUser
            roleId={roleId}
            trigger={
              <Button type="primary" icon={<PlusOutlined />} key="add">
                <T id="component.table.tool.add" />
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
          defaultPageSize: 12,
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
          <Button
            onClick={async () => {
              Modal.confirm({
                title: <T id="component.confirm.delete" />,
                content: <T id="component.confirm.select.desc" />,
                onOk: async () => {
                  const hide = message.loading(
                    t('page.role.cancelAuth.loading'),
                  );
                  if (!selectedRowsState) return true;
                  try {
                    await updateUnAuthBatchUser({
                      userIds: selectedRowsState
                        .map((row) => row.userId)
                        .join(','),
                      roleId,
                    });
                    hide();
                    message.success(t('page.role.cancelAuth.success'));
                    actionRef.current?.reloadAndRest?.();
                    Promise.resolve();
                  } catch {
                    hide();
                    message.error(t('page.role.cancelAuth.error'));
                    Promise.reject();
                  }
                },
              });
            }}
          >
            <T id="page.role.batchCancelAuth" />
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};
