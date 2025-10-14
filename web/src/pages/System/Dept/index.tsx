import { Button, Space, message, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProTable,
  ProColumns,
  ProFormText,
  ProFormDigit,
  ProFormRadio,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { queryDeptList, deleteDept } from '@/services/dept';
import { queryDictsByType } from '@/services/dict';
import { PermissionGuard } from '@/components/Layout';
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

  const columns: ProColumns[] = [
    {
      title: '上级部门',
      dataIndex: 'parentId',
      valueType: 'treeSelect',
      hideInSearch: true,
      hideInTable: true,
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
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
      valueType: 'text',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      valueType: 'digit',
      width: 120,
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
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 140,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <PermissionGuard requireds={['system:dept:edit']}>
            <UpdateDeptForm
              values={record}
              formRender={formRender('edit')}
              trigger={
                <Tooltip title="修改">
                  <Button type="link" size="small" icon={<EditOutlined />} />
                </Tooltip>
              }
              onFinish={() => {
                actionRef.current?.reload();
              }}
            />
          </PermissionGuard>
          <PermissionGuard requireds={['system:dept:add']}>
            <CreateDeptForm
              values={{ parentId: record.deptId }}
              formRender={formRender('add')}
              trigger={
                <Tooltip title="新增子部门">
                  <Button type="link" size="small" icon={<PlusOutlined />} />
                </Tooltip>
              }
              onFinish={() => {
                actionRef.current?.reload();
              }}
            />
          </PermissionGuard>
          <PermissionGuard requireds={['system:dept:remove']}>
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
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  const formRender = (source: '' | 'edit' | 'add' = '') => (
    <>
      {source === 'add' && (
        <ProFormTreeSelect
          name="parentId"
          label="上级部门"
          placeholder="请选择上级部门"
          fieldProps={{
            fieldNames: {
              label: 'deptName',
              value: 'deptId',
              children: '',
            },
          }}
          request={async () => {
            const res = await queryDeptList();
            return arrayToTree(res.data, { keyField: 'deptId' });
          }}
          rules={[{ required: true, message: '请选择上级部门' }]}
          width="md"
        />
      )}
      <ProFormText
        name="deptName"
        label="部门名称"
        placeholder="请输入部门名称"
        rules={[{ required: true, message: '请输入部门名称' }]}
        width="md"
      />
      <ProFormText
        name="leader"
        label="负责人"
        placeholder="请输入负责人"
        width="md"
      />
      <ProFormText
        name="phone"
        label="联系电话"
        placeholder="请输入联系电话"
        width="md"
      />
      <ProFormText
        name="email"
        label="邮箱"
        placeholder="请输入邮箱"
        width="md"
      />
      <ProFormDigit
        name="orderNum"
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
    </>
  );

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
          <PermissionGuard requireds={['system:dept:add']}>
            <CreateDeptForm
              formRender={formRender('add')}
              trigger={
                <Button type="primary" icon={<PlusOutlined />} key="add">
                  新建
                </Button>
              }
              onFinish={() => {
                actionRef.current?.reload();
              }}
            />
          </PermissionGuard>,
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
        columns={columns}
        pagination={false}
      />
    </PageContainer>
  );
};
