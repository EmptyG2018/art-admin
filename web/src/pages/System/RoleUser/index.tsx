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
  Badge,
} from 'antd';
import {
  ExportOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
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
import { queryDictPage, queryDictsByType, deleteDict } from '@/services/dict';
import { getRole } from '@/services/role';
import CreateDictDataForm from './components/CreateDictDataForm';
import UpdateDictDataForm from './components/UpdateDictDataForm';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteDict(selectedRows.map((row) => row.dictCode).join(','));
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
  const params = useParams();
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
    {
      title: '用户名称',
      dataIndex: 'userName',
      valueType: 'text',
      width: 140,
      formItemProps: {
        rules: [{ required: true, message: '请输入字典标签' }],
      },
      colProps: { span: 12 },
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
      formItemProps: {
        rules: [{ required: true, message: '请输入字典键值' }],
      },
      colProps: { span: 12 },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      hideInSearch: true,
      colProps: { span: 12 },
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      width: 220,
      formItemProps: {
        rules: [{ required: true, message: '请输入排序' }],
      },
      colProps: { span: 12 },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'radio',
      hideInSearch: true,
      initialValue: '0',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_normal_disable');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
      colProps: { span: 12 },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 220,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      width: 100,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space
          direction="horizontal"
          split={<Divider type="vertical" />}
          size={2}
        >
          <UpdateDictDataForm
            values={record}
            columns={columns}
            trigger={
              <Tooltip title="修改">
                <Button type="link" size="small" icon={<EditOutlined />} />
              </Tooltip>
            }
            onFinish={() => {
              actionRef.current?.reload();
            }}
          />
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
            const res = await getRole(params.roleId);
            return { success: true, data: res.data };
          }}
        />
      }
      onBack={() => navigate(-1)}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="dictCode"
        toolBarRender={() => [
          <CreateDictDataForm
            columns={columns}
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
          const { code, rows, total } = await queryDictPage({
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
