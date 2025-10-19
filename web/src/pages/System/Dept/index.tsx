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
import { rawT, useT, T } from '@/locales';
import CreateDeptForm from './components/CreateDeptForm';
import UpdateDeptForm from './components/UpdateDeptForm';
import { arrayToTree } from '@/utils/data';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (record) => {
  const hide = message.loading(rawT('component.form.message.delete.loading'));
  try {
    await deleteDept(record.deptId);
    hide();
    message.success(rawT('component.form.message.delete.success'));
    return true;
  } catch {
    hide();
    message.success(rawT('component.form.message.delete.error'));
    return false;
  }
};

export const Component: React.FC<unknown> = () => {
  const t = useT();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns[] = [
    {
      title: <T id="page.dept.field.deptParent" />,
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
      title: <T id="page.dept.field.deptName" />,
      dataIndex: 'deptName',
      valueType: 'text',
    },
    {
      title: <T id="component.field.sort" />,
      dataIndex: 'orderNum',
      valueType: 'digit',
      width: 120,
      hideInSearch: true,
    },
    {
      title: <T id="component.field.status" />,
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
      title: <T id="component.field.createTime" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 220,
      hideInSearch: true,
    },
    {
      title: <T id="component.table.action" />,
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
                <Tooltip title={<T id="component.tooltip.update" />}>
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
                <Tooltip title={<T id="page.dept.addChild" />}>
                  <Button type="link" size="small" icon={<PlusOutlined />} />
                </Tooltip>
              }
              onFinish={() => {
                actionRef.current?.reload();
              }}
            />
          </PermissionGuard>
          <PermissionGuard requireds={['system:dept:remove']}>
            <Tooltip title={<T id="component.tooltip.delete" />}>
              <Popconfirm
                title={<T id="component.confirm.delete" />}
                description={<T id="component.confirm.delete.desc" />}
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
          label={<T id="page.dept.field.deptParent" />}
          placeholder={t('component.form.placeholder.sel', {
            label: t('page.dept.field.deptParent'),
          })}
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
          rules={[
            {
              required: true,
              message: t('component.form.placeholder.sel', {
                label: t('page.dept.field.deptParent'),
              }),
            },
          ]}
          width="md"
        />
      )}
      <ProFormText
        name="deptName"
        label={<T id="page.dept.field.deptName" />}
        placeholder={t('component.form.placeholder.sel', {
          label: t('page.dept.field.deptName'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.dept.field.deptName'),
            }),
          },
        ]}
        width="md"
      />
      <ProFormText
        name="leader"
        label={<T id="page.dept.field.leader" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.dept.field.leader'),
        })}
        width="md"
      />
      <ProFormText
        name="phone"
        label={<T id="page.dept.field.phone" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.dept.field.phone'),
        })}
        width="md"
      />
      <ProFormText
        name="email"
        label={<T id="page.dept.field.email" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.dept.field.email'),
        })}
        width="md"
      />
      <ProFormDigit
        name="orderNum"
        label={<T id="component.field.sort" />}
        placeholder={t('component.field.sort.placeholder')}
        min={0}
        fieldProps={{ precision: 0 }}
        rules={[
          { required: true, message: t('component.field.sort.placeholder') },
        ]}
        width="xs"
      />
      <ProFormRadio.Group
        name="status"
        label={<T id="component.field.status" />}
        placeholder={t('component.field.status.placeholder')}
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
        headerTitle={<T id="component.table.title" />}
        actionRef={actionRef}
        rowKey="deptId"
        toolBarRender={() => [
          <PermissionGuard requireds={['system:dept:add']}>
            <CreateDeptForm
              formRender={formRender('add')}
              trigger={
                <Button type="primary" icon={<PlusOutlined />} key="add">
                  <T id="component.table.tool.add" />
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
