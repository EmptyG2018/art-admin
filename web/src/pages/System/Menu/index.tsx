import React, { useRef } from 'react';
import { Button, Space, message, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProTable,
  ProColumns,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  ProFormTreeSelect,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { queryMenuList, queryMenuTree, deleteMenu } from '@/services/menu';
import { arrayToTree } from '@/utils/data';
import { PermissionGuard } from '@/components/Layout';
import CreateMenuForm from './components/CreateMenuForm';
import UpdateMenuForm from './components/UpdateMenuForm';
import icons from '@/constants/icons';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteMenu(selectedRows.map((row) => row.menuId).join(','));
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
      title: '菜单名称',
      dataIndex: 'menuName',
      valueType: 'text',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      valueType: 'text',
      width: 140,
      hideInSearch: true,
      render: (_, item) => {
        const Icon = icons[item.icon];
        return Icon ? <Icon /> : null;
      },
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      valueType: 'text',
      width: 220,
      hideInSearch: true,
    },
    {
      title: '显示顺序',
      dataIndex: 'orderNum',
      valueType: 'text',
      width: 120,
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
      width: 120,
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
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <PermissionGuard requireds={['system:menu:add']}>
            <Tooltip title="新增">
              <CreateMenuForm
                values={{ parentId: record.menuId }}
                formRender={formRender}
                trigger={
                  <Button type="link" size="small" icon={<PlusOutlined />} />
                }
                onFinish={() => {
                  actionRef.current?.reload();
                }}
              />
            </Tooltip>
          </PermissionGuard>
          <PermissionGuard requireds={['system:menu:edit']}>
            <Tooltip title="修改">
              <UpdateMenuForm
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
          </PermissionGuard>
          <PermissionGuard requireds={['system:menu:remove']}>
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
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  const formRender = (
    <>
      <ProFormTreeSelect
        name="parentId"
        label="上级菜单"
        placeholder="请选择上级菜单"
        rules={[{ required: true, message: '请选择上级菜单' }]}
        width="md"
        initialValue={0}
        fieldProps={{
          fieldNames: { label: 'label', value: 'id', children: 'children' },
        }}
        request={async () => {
          const res = await queryMenuTree();
          return [
            {
              id: 0,
              label: '根菜单',
              children: arrayToTree(res.data, { keyField: 'id' }),
            },
          ];
        }}
      />
      <ProFormRadio.Group
        name="menuType"
        label="菜单类型"
        placeholder="请选择状态"
        initialValue="M"
        radioType="button"
        options={[
          { label: '目录', value: 'M' },
          { label: '菜单', value: 'C' },
          { label: '按钮', value: 'F' },
        ]}
        rules={[{ required: true, message: '请选择菜单类型' }]}
      />
      <ProFormDependency name={['menuType']}>
        {({ menuType }) => (
          <>
            <ProForm.Group>
              <ProFormText
                name="menuName"
                label="菜单名称"
                placeholder="请输入菜单名称"
                rules={[{ required: true, message: '请输入菜单名称' }]}
                width="md"
              />
              {['M'].includes(menuType) && (
                <ProFormSelect
                  name="icon"
                  label="菜单图标"
                  placeholder="请输入菜单图标"
                  width="sm"
                  showSearch
                  fieldProps={{
                    optionRender: (option) => (
                      <Space>
                        {option.data.icon}
                        {option.data.label}
                      </Space>
                    ),
                  }}
                  options={Object.entries(icons).map(
                    ([key, IconComponent]) => ({
                      icon: <IconComponent />,
                      label: key,
                      value: key,
                    }),
                  )}
                />
              )}
            </ProForm.Group>
            {['C'].includes(menuType) && (
              <ProFormRadio.Group
                name="isFrame"
                label="是否外链"
                placeholder="请选择是否外链"
                initialValue="1"
                options={[
                  { label: '是', value: '0' },
                  { label: '否', value: '1' },
                ]}
                rules={[{ required: true, message: '请选择是否外链' }]}
              />
            )}

            <ProForm.Group>
              {['M', 'C'].includes(menuType) && (
                <ProFormText
                  name="path"
                  label="路由地址"
                  placeholder="请输入路由地址"
                  rules={[{ required: true, message: '请输入路由地址' }]}
                  width="md"
                />
              )}
              {['C'].includes(menuType) && (
                <ProFormText
                  name="query"
                  label="路由参数"
                  placeholder="请输入路由参数"
                  width="md"
                />
              )}
              {['C'].includes(menuType) && (
                <ProFormText
                  name="component"
                  label="组件路径"
                  placeholder="请输入组件路径"
                  width="md"
                />
              )}
            </ProForm.Group>
            {['C', 'F'].includes(menuType) && (
              <ProFormText
                name="perms"
                label="权限字符"
                placeholder="请输入组件权限字符"
                width="md"
              />
            )}
            <ProFormDigit
              name="orderNum"
              label="排序"
              placeholder="请输入排序"
              min={1}
              rules={[{ required: true, message: '请输入排序' }]}
              width="xs"
              fieldProps={{ precision: 0 }}
            />
            {['C'].includes(menuType) && (
              <ProFormRadio.Group
                name="isCache"
                label="是否缓存"
                placeholder="请选择是否缓存"
                initialValue="0"
                options={[
                  { label: '是', value: '0' },
                  { label: '否', value: '1' },
                ]}
              />
            )}
            <ProForm.Group>
              {['M', 'C'].includes(menuType) && (
                <ProFormRadio.Group
                  name="visible"
                  label="显示状态"
                  placeholder="请选择显示状态"
                  initialValue="0"
                  options={[
                    { label: '是', value: '0' },
                    { label: '否', value: '1' },
                  ]}
                  request={async () => {
                    const res = await queryDictsByType('sys_show_hide');
                    return res.data.map((dict) => ({
                      label: dict.dictLabel,
                      value: dict.dictValue,
                    }));
                  }}
                />
              )}
              <ProFormRadio.Group
                name="status"
                label="菜单状态"
                placeholder="请选择菜单状态"
                initialValue="0"
                request={async () => {
                  const res = await queryDictsByType('sys_normal_disable');
                  return res.data.map((dict) => ({
                    label: dict.dictLabel,
                    value: dict.dictValue,
                  }));
                }}
              />
            </ProForm.Group>
          </>
        )}
      </ProFormDependency>
    </>
  );

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
          <PermissionGuard requireds={['system:menu:add']}>
            <CreateMenuForm
              formRender={formRender}
              trigger={
                <Button type="primary" icon={<PlusOutlined />} key="add">
                  新建
                </Button>
              }
            />
          </PermissionGuard>,
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
        scroll={{ x: 1400 }}
      />
    </PageContainer>
  );
};
