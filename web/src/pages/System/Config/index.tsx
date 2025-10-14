import React, { useRef, useState } from 'react';
import {
  Button,
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
import { queryDictsByType } from '@/services/dict';
import { queryConfigPage, deleteConfig } from '@/services/config';
import CreateConfigForm from './components/CreateConfigForm';
import UpdateConfigForm from './components/UpdateConfigForm';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteConfig(selectedRows.map((row) => row.configId).join(','));
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
      title: '参数主键',
      dataIndex: 'configId',
      hideInSearch: true,
      width: 140,
    },
    {
      title: '参数名称',
      dataIndex: 'configName',
      valueType: 'text',
      width: 180,
    },
    {
      title: '参数键名',
      dataIndex: 'configKey',
      valueType: 'text',
      width: 180,
    },
    {
      title: '参数键值',
      dataIndex: 'configValue',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '系统内置',
      dataIndex: 'configType',
      valueType: 'select',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_yes_no');
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
      width: 100,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <UpdateConfigForm
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
        name="configName"
        label="参数名称"
        placeholder="请输入参数名称"
        rules={[{ required: true, message: '请输入参数名称' }]}
        width="md"
      />
      <ProFormText
        name="configKey"
        label="参数键名"
        placeholder="请输入参数键名"
        rules={[{ required: true, message: '请输入参数键名' }]}
        width="md"
      />
      <ProFormText
        name="configValue"
        label="参数键值"
        placeholder="请输入参数键值"
        rules={[{ required: true, message: '请输入参数键值' }]}
        width="md"
      />
      <ProFormRadio.Group
        name="configType"
        label="系统内置"
        placeholder="请选择系统内置"
        initialValue="Y"
        request={async () => {
          const res = await queryDictsByType('sys_yes_no');
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
        title: '参数设置',
      }}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="configId"
        toolBarRender={() => [
          <CreateConfigForm
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
          const { code, rows, total } = await queryConfigPage({
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
