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
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import {
  queryDictPage,
  queryDictsByType,
  getDictType,
  deleteDict,
} from '@/services/dict';
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

interface TableListProps {
  dictType: string;
}

const TableList: React.FC<TableListProps> = (props) => {
  const { dictType } = props;
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const columns: ProColumns[] = [
    {
      title: '字典编号',
      dataIndex: 'dictCode',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '字典标签',
      dataIndex: 'dictLabel',
      valueType: 'text',
      width: 140,
    },
    {
      title: '字典键值',
      dataIndex: 'dictValue',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '排序',
      dataIndex: 'dictSort',
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
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 100,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <UpdateDictDataForm
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
        name="dictLabel"
        label="字典标签"
        placeholder="请输入字典标签"
        rules={[{ required: true, message: '请输入字典标签' }]}
        width="md"
      />
      <ProFormText
        name="dictValue"
        label="字典键值"
        placeholder="请输入字典键值"
        rules={[{ required: true, message: '请输入字典键值' }]}
        width="md"
      />
      <ProFormText
        name="cssClass"
        label="样式类名"
        placeholder="请输入回显类名"
        width="md"
      />
      <ProFormSelect
        name="listClass"
        label="回显样式"
        placeholder="请输入回显样式"
        valueEnum={{
          Default: { text: '默认(Default)', status: 'Default' },
          Processing: { text: '主要(Processing)', status: 'Processing' },
          Success: { text: '成功(Success)', status: 'Success' },
          Warning: { text: '警告(Warning)', status: 'Warning' },
          Error: { text: '错误(Error)', status: 'Error' },
        }}
        fieldProps={{
          optionRender: (option) => {
            const statusMap = {
              Default: 'default',
              Processing: 'processing',
              Success: 'success',
              Warning: 'warning',
              Error: 'error',
            };

            return (
              <Badge
                offset={[4, 0]}
                status={statusMap[option.value] || ''}
                text={option.label}
              />
            );
          },
        }}
        width="md"
      />
      <ProFormDigit
        name="dictSort"
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
    <>
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="dictCode"
        toolBarRender={() => [
          <CreateDictDataForm
            values={{ dictType }}
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
            dictType,
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
    </>
  );
};

export const Component: React.FC<unknown> = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { loading, data } = useRequest(
    async () => {
      const res = await getDictType(params.dictId);
      return res.data;
    },
    {
      refreshDeps: [params.dictId],
    },
  );

  const columns: ProColumns[] = [
    {
      title: '字典编号',
      dataIndex: 'dictId',
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
      valueType: 'text',
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
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
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];

  return (
    <PageContainer
      header={{
        title: '字典数据',
      }}
      content={
        <ProDescriptions
          columns={columns}
          column={{ sm: 1, md: 2, lg: 2, xl: 2 }}
          loading={loading}
          dataSource={data}
        />
      }
      onBack={() => navigate(-1)}
    >
      {!!data?.dictType && <TableList dictType={data.dictType} />}
    </PageContainer>
  );
};
