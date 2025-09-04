import React, { useRef, useState } from 'react';
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
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProTable,
  ProColumns,
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
      hideInForm: true,
      width: 140,
    },
    {
      title: '参数名称',
      dataIndex: 'configName',
      valueType: 'text',
      width: 180,
      formItemProps: {
        rules: [{ required: true, message: '请输入参数名称' }],
      },
      colProps: { span: 12 },
    },
    {
      title: '参数键名',
      dataIndex: 'configKey',
      valueType: 'text',
      width: 180,
      formItemProps: {
        rules: [{ required: true, message: '请输入参数键名' }],
      },
      colProps: { span: 12 },
    },
    {
      title: '参数键值',
      dataIndex: 'configValue',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
      formItemProps: {
        rules: [{ required: true, message: '请输入参数值' }],
      },
      colProps: { span: 12 },
    },
    {
      title: '系统内置',
      dataIndex: 'configType',
      valueType: 'radio',
      initialValue: 'Y',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_yes_no');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
      colProps: { span: 12 },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInSearch: true,
      colProps: { span: 24 },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      width: 220,
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
          <UpdateConfigForm
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
        title: '参数设置',
      }}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="configId"
        toolBarRender={() => [
          <CreateConfigForm
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
          current: 1,
          pageSize: 15,
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
