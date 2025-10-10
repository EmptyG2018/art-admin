import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Divider,
  Space,
  message,
  Dropdown,
  Tooltip,
  Popconfirm,
  Modal,
} from 'antd';
import {
  ExportOutlined,
  EllipsisOutlined,
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  HddOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProTable,
  ProColumns,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  queryDictTypePage,
  queryDictsByType,
  deleteDictType,
} from '@/services/dict';
import CreateDictForm from './components/CreateDictForm';
import UpdateDictForm from './components/UpdateDictForm';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteDictType(selectedRows.map((row) => row.dictId).join(','));
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
      title: '字典编号',
      dataIndex: 'dictId',
      hideInSearch: true,
      hideInForm: true,
      width: 140,
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
      valueType: 'text',
      width: 140,
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      valueType: 'text',
      width: 180,
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
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 220,
    },
    {
      title: '操作',
      width: 140,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space
          direction="horizontal"
          split={<Divider type="vertical" />}
          size={2}
        >
          <Tooltip title="字典数据">
            <Link to={`../dict/${record.dictId}`}>
              <Button type="link" size="small" icon={<HddOutlined />} />
            </Link>
          </Tooltip>
          <UpdateDictForm
            values={record}
            formRender={formRender}
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

  const formRender = (
    <>
      <ProFormText
        name="dictName"
        label="字典名称"
        placeholder="请输入字典名称"
        rules={[{ required: true, message: '请输入字典名称' }]}
        width="md"
      />
      <ProFormText
        name="dictType"
        label="字典类型"
        placeholder="请输入字典类型"
        rules={[{ required: true, message: '请输入字典类型' }]}
        width="md"
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
        title: '字典管理',
      }}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="dictId"
        toolBarRender={() => [
          <CreateDictForm
            formRender={formRender}
            trigger={
              <Button type="primary" icon={<PlusOutlined />} key="add">
                新建
              </Button>
            }
            onFinish={() => {
              actionRef.current?.reload();
            }}
          />,
          <Button
            icon={<ReloadOutlined />}
            key="export"
            onClick={() => handleModalVisible(true)}
          >
            刷新缓存
          </Button>,
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
          const { code, rows, total } = await queryDictTypePage({
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
