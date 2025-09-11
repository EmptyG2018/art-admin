import { Button, Divider, Space, Drawer, message, Tooltip } from 'antd';
import {
  ActionType,
  PageContainer,
  ProDescriptions,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { queryMenuList } from '@/services/menu';
import CreateForm from './components/CreateForm';
import { arrayToTree } from '@/utils/data';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser({
      userId: selectedRows.find((row) => row.id)?.id || '',
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

export const Component: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.UserInfo>();
  const [expandedRowKeys, setexpandedRowKeys] = useState<Menu.Item['menuId'][]>(
    [],
  );

  const columns: ProColumns[] = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      valueType: 'text',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '显示顺序',
      dataIndex: 'orderNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: { text: '正常', status: 'MALE' },
        1: { text: '停用', status: 'FEMALE' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',

      hideInSearch: true,
    },
    {
      title: '操作',
      width: 140,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space
          direction="horizontal"
          split={<Divider type="vertical" />}
          size={2}
        >
          <Tooltip title="新增">
            <Button type="link" size="small" icon={<PlusOutlined />} />
          </Tooltip>
          <Tooltip title="修改">
            <Button type="link" size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="删除">
            <Button type="link" size="small" icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '菜单管理',
      }}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="menuId"
        toolBarRender={() => [
          <Button type="primary" icon={<PlusOutlined />} key="add">
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data } = await queryMenuList({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: data,
            success: true,
          };
        }}
        postData={(rows: any) => {
          return arrayToTree(rows, { keyField: 'menuId' });
        }}
        columns={columns}
        pagination={false}
      />
    </PageContainer>
  );
};
