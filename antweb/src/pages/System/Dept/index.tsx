import { Button, Divider, Space, message, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { queryDeptList, deleteDept } from '@/services/dept';
import { queryDictsByType } from '@/services/dict';
import CreateDeptForm from './components/CreateDeptForm';
import UpdateDeptForm from './components/UpdateDeptForm';
import { arrayToTree } from '@/utils/data';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (record) => {
  const hide = message.loading('正在删除');
  try {
    await deleteDept(record.deptId);
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

  const getColumns = (souce: '' | 'edit' | 'add' = ''): ProColumns[] => [
    {
      title: '上级部门',
      dataIndex: 'parentId',
      valueType: 'treeSelect',
      hideInSearch: true,
      hideInTable: true,
      hideInForm: ['edit'].includes(souce),
      formItemProps: {
        rules: [{ required: true, message: '请选择上级部门' }],
      },
      fieldProps: {
        fieldNames: {
          label: 'deptName',
          value: 'deptId',
          children: '',
        },
      },
      request: async () => {
        const res = await queryDeptList();
        return arrayToTree(res.data, { keyField: 'deptId' });
      },
      colProps: { span: 24 },
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入部门名称' }],
      },
      colProps: { span: 12 },
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      valueType: 'text',
      width: 160,
      hideInSearch: true,
      hideInTable: true,
      colProps: { span: 12 },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      valueType: 'text',
      width: 160,
      hideInSearch: true,
      hideInTable: true,
      colProps: { span: 12 },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      width: 160,
      hideInSearch: true,
      hideInTable: true,
      colProps: { span: 12 },
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      valueType: 'digit',
      width: 120,
      initialValue: 0,
      hideInSearch: true,
      formItemProps: {
        rules: [{ required: true, message: '请输入排序' }],
      },
      colProps: { span: 12 },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      width: 120,
      initialValue: '0',
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
      colProps: { span: 12 },
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
          <UpdateDeptForm
            values={record}
            columns={getColumns('edit')}
            trigger={
              <Tooltip title="修改">
                <Button type="link" size="small" icon={<EditOutlined />} />
              </Tooltip>
            }
            onFinish={() => {
              actionRef.current?.reload();
            }}
          />
          <CreateDeptForm
            values={{ parentId: record.deptId }}
            columns={getColumns('add')}
            trigger={
              <Tooltip title="新增子部门">
                <Button type="link" size="small" icon={<PlusOutlined />} />
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
                await handleRemove(record);
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
        title: '部门管理',
      }}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="deptId"
        toolBarRender={() => [
          <CreateDeptForm
            columns={getColumns('add')}
            trigger={
              <Button type="primary" icon={<PlusOutlined />} key="add">
                新建
              </Button>
            }
            onFinish={() => {
              actionRef.current?.reload();
            }}
          />,
        ]}
        request={async (params, sorter, filter) => {
          const { data } = await queryDeptList({
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
          return arrayToTree(rows, { keyField: 'deptId' });
        }}
        columns={getColumns('')}
        pagination={false}
      />
    </PageContainer>
  );
};
