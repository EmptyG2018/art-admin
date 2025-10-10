import {
  Button,
  Divider,
  Space,
  message,
  Tooltip,
  Dropdown,
  Popconfirm,
  Modal,
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
  ProTable,
  ProColumns,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormRadio,
} from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { queryPostPage, deletePost } from '@/services/post';
import { queryDictsByType } from '@/services/dict';
import CreatePostForm from './components/CreatePostForm';
import UpdatePostForm from './components/UpdatePostForm';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deletePost(selectedRows.map((row) => row.postId).join(','));
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
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const columns: ProColumns[] = [
    {
      title: '岗位编号',
      dataIndex: 'postId',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '岗位编码',
      dataIndex: 'postCode',
      valueType: 'text',
      width: 160,
    },
    {
      title: '岗位名称',
      dataIndex: 'postName',
      valueType: 'text',
      width: 160,
    },
    {
      title: '排序',
      dataIndex: 'postSort',
      valueType: 'digit',
      width: 120,
      initialValue: 0,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_normal_disable');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 220,
    },
    {
      title: '操作',
      width: 100,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space
          direction="horizontal"
          split={<Divider type="vertical" />}
          size={2}
        >
          <Tooltip title="修改">
            <UpdatePostForm
              values={record}
              formRender={formRender}
              trigger={
                <Button type="link" size="small" icon={<EditOutlined />} />
              }
              onFinish={() => {
                actionRef.current?.reload();
              }}
            />
          </Tooltip>
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

  const formRender = (
    <>
      <ProFormText
        name="postName"
        label="岗位名称"
        placeholder="请输入岗位名称"
        rules={[{ required: true, message: '请输入岗位名称' }]}
        width="md"
      />
      <ProFormText
        name="postCode"
        label="岗位编码"
        placeholder="请输入岗位编码"
        rules={[{ required: true, message: '请输入岗位编码' }]}
        width="md"
      />
      <ProFormDigit
        name="postSort"
        label="排序"
        placeholder="请输入排序"
        min={0}
        fieldProps={{ precision: 0 }}
        rules={[{ required: true, message: '请输入排序' }]}
        width="xs"
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        placeholder="请选择状态"
        initialValue="0"
        request={async () => {
          const res = await queryDictsByType('sys_normal_disable');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        width="lg"
        placeholder="请输入备注"
      />
    </>
  );

  return (
    <PageContainer
      header={{
        title: '岗位管理',
      }}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="postId"
        toolBarRender={() => [
          <CreatePostForm
            formRedner={formRender}
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
          const { code, rows, total } = await queryPostPage({
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
